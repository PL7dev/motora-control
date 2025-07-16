const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado com este email.' });
    }

    // Gerar token e definir validade
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hora

    usuario.resetToken = token;
    usuario.resetExpires = expires;
    await usuario.save();

    // Simula envio de e-mail
    const link = `http://localhost:5173/reset-password/${token}`;
    console.log(`Link de recuperação de senha: ${link}`);

    res.json({ msg: 'Link de recuperação enviado para o email (simulado no console).' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao solicitar recuperação de senha.' });
  }
});

// Rota para redefinir a senha
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  try {
    const usuario = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() } // token ainda válido
    });

    if (!usuario) {
      return res.status(400).json({ msg: 'Token inválido ou expirado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

    usuario.senha = senhaCriptografada;
    usuario.resetToken = undefined;
    usuario.resetExpires = undefined;
    await usuario.save();

    res.json({ msg: 'Senha redefinida com sucesso!' });
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao redefinir senha.' });
  }
});


const authMiddleware = require('../middleware/authMiddleware');

router.get('/protegido', authMiddleware, (req, res) => {
  res.json({
    msg: 'Você acessou uma rota protegida',
    userId: req.user.userId,
  });
});

// GET /me → retornar dados do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-senha');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar dados do usuário' });
  }
});


module.exports = router;