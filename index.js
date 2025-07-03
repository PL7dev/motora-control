require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const registroRoutes = require('./routes/registro');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('API do Uber Control funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

app.use('/api/registro', registroRoutes);

const errorHandler = require('./middleware/errorHandler');

app.use(errorHandler);