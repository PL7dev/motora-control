require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const registroRoutes = require('./routes/registro');
const errorHandler = require('./middleware/errorHandler');
const perfilRoutes = require('./routes/perfil');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // substitua aqui
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/registro', registroRoutes);
app.use('/api/perfil', perfilRoutes);

app.get('/', (req, res) => {
  res.send('API do Motora Control funcionando!');
});

app.use(errorHandler);

if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
