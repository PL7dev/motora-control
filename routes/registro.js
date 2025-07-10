const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
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

    // Construir filtro de data
    let matchDate = {};
    const now = new Date();

    if (filter === 'hoje') {
      const inicioHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const fimHoje = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      matchDate = { data: { $gte: inicioHoje, $lt: fimHoje } };
    } else if (filter === 'estaSemana') {
      // Pega domingo da semana atual
      const diaSemana = now.getDay(); // 0 (domingo) a 6 (sábado)
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
      dataFim.setDate(dataFim.getDate() + 1); // inclui o dia final completo
      matchDate = { data: { $gte: dataInicio, $lt: dataFim } };
    } else {
      // Se não passou filtro, pega tudo do usuário
      matchDate = {};
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

    res.json(registros[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar dashboard' });
  }
});

module.exports = router;