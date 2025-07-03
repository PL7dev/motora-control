const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

jest.setTimeout(20000);

describe('Testes de autenticação', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    it('Deve retornar erro se faltar campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ nome: 'PL' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toBeDefined();
    });

    it('Deve criar usuário com dados válidos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Pedro Lucas',
          email: 'pedro@test.com',
          senha: '123456',
          modeloCarro: 'Ford Ka',
          kmPorLitro: 12,
          metaLucroDiario: 100
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('Não deve criar usuário com email repetido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          nome: 'Pedro Lucas',
          email: 'pedro@test.com',
          senha: '123456',
          modeloCarro: 'Ford Ka',
          kmPorLitro: 12,
          metaLucroDiario: 100
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toMatch(/usuário já existe/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('Deve retornar erro se email não enviado', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ senha: '123456' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toMatch(/email/i);
    });

    it('Deve retornar erro se senha não enviada', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pedro@test.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toMatch(/senha/i);
    });

    it('Deve retornar erro se usuário não existe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inexistente@test.com', senha: '123456' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toMatch(/não encontrado/i);
    });

    it('Deve retornar erro se senha incorreta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pedro@test.com', senha: 'senhaerrada' });

      expect(res.statusCode).toBe(400);
      expect(res.body.msg).toMatch(/senha incorreta/i);
    });

    it('Deve logar com dados corretos', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pedro@test.com', senha: '123456' });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });
});
