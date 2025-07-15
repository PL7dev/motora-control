const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const validate = require('../validations/validateMiddleware');
const { registroSchema } = require('../validations/registroValidation');

router.post('/', authMiddleware, validate(registroSchema), async (req, res) => {
  const { quilometragem, valorBruto, gastoCombustivel, valorCombustivelLitro } = req.body;

  try {
    const lucroLiquido = Number(valorBruto) - Number(gastoCombustivel);

    const novoRegistro = new Registro({
      userId: req.user.userId,
      quilometragem,
      valorBruto,
      gastoCombustivel,
      valorCombustivelLitro,
      lucroLiquido,
    });

    const registroSalvo = await novoRegistro.save();
    res.status(201).json(registroSalvo);
  } catch (error) {
    res.status(500).json({ msg: `Erro ao salvar o registro: ${error.message}` });
  }
});

router.get('/historico', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start, end, page = 1, limit = 10 } = req.query;

    // Montar filtro de data se start e end existirem
    let matchDate = {};
    if (start && end) {
      const dataInicio = new Date(start);
      const dataFim = new Date(end);
      dataFim.setDate(dataFim.getDate() + 1);
      matchDate = { data: { $gte: dataInicio, $lt: dataFim } };
    }

    // Query para contar total de registros (com filtro)
    const total = await Registro.countDocuments({ userId, ...matchDate });

    // Buscar registros paginados e ordenados pela data desc
    const registros = await Registro.find({ userId, ...matchDate })
      .sort({ data: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      registros,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar histórico' });
  }
});


router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { filter, start, end } = req.query;

    const usuario = await User.findById(userId).select('modeloCarro kmPorLitro metaLucroDiario');
    if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });

    const ultimoRegistro = await Registro.findOne({ userId }).sort({ data: -1 });
    const precoCombustivel = ultimoRegistro?.valorCombustivelLitro || 6.29;

    let matchDate = {};
    const now = new Date();

    if (filter === 'hoje') {
      const inicioHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const fimHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      matchDate = { data: { $gte: inicioHoje, $lt: fimHoje } };
    } else if (filter === 'estaSemana') {
      const diaSemana = now.getDay();
      const domingo = new Date(now);
      domingo.setDate(now.getDate() - diaSemana);
      const proximoDomingo = new Date(domingo);
      proximoDomingo.setDate(domingo.getDate() + 7);
      matchDate = { data: { $gte: domingo, $lt: proximoDomingo } };
    } else if (filter === 'esteMes') {
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
      const inicioProxMes = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      matchDate = { data: { $gte: inicioMes, $lt: inicioProxMes } };
    } else if (filter === 'personalizado' && start && end) {
      const dataInicio = new Date(start);
      const dataFim = new Date(end);
      dataFim.setDate(dataFim.getDate() + 1);
      matchDate = { data: { $gte: dataInicio, $lt: dataFim } };
    }

    const registros = await Registro.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId), ...matchDate } },
  {
    $facet: {
      porDia: [
        {
          $group: {
            _id: {
              ano: { $year: '$data' },
              mes: { $month: '$data' },
              dia: { $dayOfMonth: '$data' },
            },
            totalLucro: { $sum: '$lucroLiquido' },
            totalKm: { $sum: '$quilometragem' },
            totalValorBruto: { $sum: '$valorBruto' },
            totalGastoCombustivel: { $sum: '$gastoCombustivel' },
          },
        },
        { $sort: { '_id.ano': -1, '_id.mes': -1, '_id.dia': -1 } },
      ],
      porSemana: [
        {
          $group: {
            _id: {
              ano: { $year: '$data' },
              semana: { $week: '$data' },
            },
            totalLucro: { $sum: '$lucroLiquido' },
            totalKm: { $sum: '$quilometragem' },
            totalValorBruto: { $sum: '$valorBruto' },
            totalGastoCombustivel: { $sum: '$gastoCombustivel' },
          },
        },
        { $sort: { '_id.ano': -1, '_id.semana': -1 } },
      ],
      porMes: [
        {
          $group: {
            _id: {
              ano: { $year: '$data' },
              mes: { $month: '$data' },
            },
            totalLucro: { $sum: '$lucroLiquido' },
            totalKm: { $sum: '$quilometragem' },
            totalValorBruto: { $sum: '$valorBruto' },
            totalGastoCombustivel: { $sum: '$gastoCombustivel' },
          },
        },
        { $sort: { '_id.ano': -1, '_id.mes': -1 } },
      ],
      totalGastoCombustivel: [
        {
          $group: {
            _id: null,
            total: { $sum: '$gastoCombustivel' },
          },
        },
      ],
    },
  },
]);

const totalGastoCombustivel = registros[0].totalGastoCombustivel.length > 0
  ? registros[0].totalGastoCombustivel[0].total
  : 0;

    const porDiaComMeta = registros[0].porDia.map((dia) => {
      const bateu = dia.totalLucro >= usuario.metaLucroDiario;
      return { ...dia, metaBateu: bateu };
    });

    res.json({
    usuario: {
      modeloCarro: usuario.modeloCarro,
      kmPorLitro: usuario.kmPorLitro,
      metaLucroDiario: usuario.metaLucroDiario,
    },
    precoCombustivel,
    totalGastoCombustivel: registros[0].totalGastoCombustivel.length > 0
    ? registros[0].totalGastoCombustivel[0].total
    : 0,
    porDia: porDiaComMeta,
    porSemana: registros[0].porSemana,
    porMes: registros[0].porMes,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar dashboard' });
  }
});

module.exports = router;