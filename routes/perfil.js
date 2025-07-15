const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET - Obter dados do perfil do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-senha');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar perfil', erro: err.message });
  }
});

// PUT - Atualizar dados do usuário logado
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { modeloCarro, kmPorLitro, metaLucroDiario } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { modeloCarro, kmPorLitro, metaLucroDiario },
      { new: true, runValidators: true }
    ).select('-senha');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao atualizar perfil', erro: err.message });
  }
});

module.exports = router;
