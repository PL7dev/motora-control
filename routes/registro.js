const express = require('express');
const router = express.Router();
const Registro = require('../models/Registro');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
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

module.exports = router;