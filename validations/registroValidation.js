const Joi = require('joi');

const registroSchema = Joi.object({
  quilometragem: Joi.number().positive().min(1).max(1000).required().messages({
    'number.base': 'Quilometragem deve ser um número',
    'number.positive': 'Quilometragem deve ser positiva',
    'number.min': 'Quilometragem mínima é 1',
    'number.max': 'Quilometragem máxima é 1000',
    'any.required': 'Quilometragem é obrigatória',
  }),
  valorBruto: Joi.number().positive().required().messages({
    'number.base': 'Valor bruto deve ser um número',
    'number.positive': 'Valor bruto deve ser positivo',
    'any.required': 'Valor bruto é obrigatório',
  }),
  gastoCombustivel: Joi.number().positive().required().messages({
    'number.base': 'Gasto com combustível deve ser um número',
    'number.positive': 'Gasto com combustível deve ser positivo',
    'any.required': 'Gasto com combustível é obrigatório',
  }),
  valorCombustivelLitro: Joi.number().positive().required().messages({
    'number.base': 'Valor do combustível por litro deve ser um número',
    'number.positive': 'Valor do combustível por litro deve ser positivo',
    'any.required': 'Valor do combustível por litro é obrigatório',
  }),
});

module.exports = { registroSchema };
