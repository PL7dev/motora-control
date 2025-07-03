const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const validate = require('../validations/validateMiddleware');
const { registroSchema } = require('../validations/registroValidation');

router.post('/', authMiddleware, validate(registroSchema), async (req, res) => {
    const { quilometragem, valorBruto, gastoCombustivel, valorCombustivelLitro, lucroLiquido } = req.body;

    try {
        const novoRegistro = new Registro({
            userId: req.user.userId,
            quilometragem,
            valorBruto,
            gastoCombustivel,
            valorCombustivelLitro,
            lucroLiquido
        });

        const registroSalvo = await novoRegistro.save();
        res.status(201).json(registroSalvo);
    } catch (error) {
        res.status(500).send(`Erro ao salvar o registro: ${error.message}`);
    }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;;

        const registros = await Registro.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $facet: {
                    porDia: [
                        {
                            $group: {
                                _id: {
                                    ano: { $year: '$data' },
                                    mes: { $month: '$data' },
                                    dia: { $dayOfMonth: '$data' }
                                },
                            totalLucro: { $sum: '$lucroLiquido' },
                            totalKm: { $sum: '$quilometragem' }
                            },
                        },
                        { $sort: { '_id.ano': -1, '_id.mes': -1, '_id.dia': -1 } },
                    ],
                    porSemana: [
                        {
                            $group: {
                                _id: {
                                    ano: { $year: '$data' },
                                    semana: { $week: '$data' }
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
