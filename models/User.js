const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  modeloCarro: { type: String },
  kmPorLitro: { type: Number, default: 10 },
  metaLucroDiario: { type: Number, default: 100 }
});

module.exports = mongoose.model('User', UserSchema);
