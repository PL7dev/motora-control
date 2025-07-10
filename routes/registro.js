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

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { filter, start, end } = req.query;

    // Busca dados do usuário
    const usuario = await User.findById(userId).select('modeloCarro kmPorLitro metaLucroDiario');
    if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado' });

    // Construir filtro de data
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
    } else {
      matchDate = {}; // sem filtro
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
              },
            },
            { $sort: { '_id.ano': -1, '_id.mes': -1 } },
          ],
        },
      },
    ]);

    // Adicionar metaBateu em porDia
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