const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização está presente
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreta');
        req.user = decoded; // Armazena os dados do usuário decodificado no objeto de requisição
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token inválido' });
    }
};

module.exports = authMiddleware;