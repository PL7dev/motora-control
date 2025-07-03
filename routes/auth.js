const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../validations/validateMiddleware');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const router = express.Router();

// Rota POST /register
router.post('/register', validate(registerSchema), async (req, res) => {
  const { nome, email, senha, modeloCarro, kmPorLitro, metaLucroDiario } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Usuário já existe' });

    // Criar novo usuário
    user = new User({
      nome,
      email,
      senha,
      modeloCarro,
      kmPorLitro,
      metaLucroDiario
    });

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);

    await user.save();

    // Criar payload para JWT
    const payload = { userId: user.id };

    // Assinar token (mude 'secreta' para algo mais seguro no .env)
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secreta',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;

// ROTA POST /login
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o usuário existe
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

    // Comparar senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

    // Criar payload para JWT
    const payload = { userId: user.id };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secreta',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

const authMiddleware = require('../middleware/authMiddleware');

router.get('/protegido', authMiddleware, (req, res) => {
  res.json({
    msg: 'Você acessou uma rota protegida',
    userId: req.user.userId,
  });
});