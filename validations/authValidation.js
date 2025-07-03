const Joi = require('joi');

const registerSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required().messages({
    'string.base': 'Nome deve ser texto',
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter pelo menos 3 caracteres',
    'string.max': 'Nome pode ter até 50 caracteres',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Informe um email válido',
    'string.empty': 'Email é obrigatório'
  }),
  senha: Joi.string().min(6).max(20).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'string.max': 'Senha deve ter no máximo 20 caracteres',
  }),
  modeloCarro: Joi.string().min(2).max(30).required().messages({
    'string.empty': 'Modelo do carro é obrigatório',
    'string.min': 'Modelo do carro deve ter pelo menos 2 caracteres',
    'string.max': 'Modelo do carro pode ter até 30 caracteres',
  }),
  kmPorLitro: Joi.number().positive().min(1).max(100).required().messages({
    'number.base': 'KM por litro deve ser um número',
    'number.positive': 'KM por litro deve ser positivo',
    'number.min': 'KM por litro deve ser pelo menos 1',
    'number.max': 'KM por litro não pode ser maior que 100',
  }),
  metaLucroDiario: Joi.number().positive().min(10).max(10000).required().messages({
    'number.base': 'Meta de lucro deve ser um número',
    'number.positive': 'Meta de lucro deve ser positiva',
    'number.min': 'Meta de lucro deve ser pelo menos 10',
    'number.max': 'Meta de lucro não pode ser maior que 10000',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Informe um email válido',
    'string.empty': 'Email é obrigatório',
  }),
  senha: Joi.string().min(6).max(20).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'string.max': 'Senha deve ter no máximo 20 caracteres',
  }),
});

module.exports = { registerSchema, loginSchema };
