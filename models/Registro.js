const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  quilometragem: {
    type: Number,
    required: true
  },
  valorBruto: {
    type: Number,
    required: true
  },
  gastoCombustivel: {
    type: Number,
    required: true
  },
  valorCombustivelLitro: {
    type: Number,
    required: true
  },
  lucroLiquido: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Registro', RegistroSchema);