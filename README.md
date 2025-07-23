# 🚗 Motora Control

Motora Control é uma aplicação web desenvolvida com o objetivo de proporcionar aos motoristas de aplicativo um controle financeiro mais preciso, prático e confiável.
O projeto surgiu a partir de uma necessidade real identificada durante minha experiência como motorista: os aplicativos de transporte geralmente não oferecem relatórios detalhados que levem em consideração todos os custos envolvidos na operação, como combustível, quilometragem e metas pessoais de rendimento. Isso dificulta a análise do lucro real ao final do dia ou mês.

Pensando nisso, o Motora Control foi criado para oferecer:
- Registro completo de corridas e despesas, com cálculo automático de lucro líquido;
- Acompanhamento de metas de lucro diário;
- Visualizações gráficas para análise de desempenho;
- Histórico detalhado com filtros, ordenações e exportação em PDF.

A aplicação foi desenvolvida com foco em usabilidade, organização e clareza dos dados, visando otimizar a gestão financeira dos profissionais do transporte.

---

## 📸 Demonstrações
### 🔐 Login e Cadastro
![Login](https://i.imgur.com/8Coq6s8.png)

![Cadastro](https://i.imgur.com/r0rTkQU.png)

### 📊 Dashboard e Gráficos
![Dashboard](https://i.imgur.com/CaDirf3.png)
![Gráfico1](https://i.imgur.com/h8lNMyf.png)
![Gráfico2](https://i.imgur.com/knBItOQ.png)

### 🧾 Registro de Corrida
![Registro de Corrida](https://i.imgur.com/NNMcMcW.png)

### 📂 Histórico Detalhado
![Histórico](https://i.imgur.com/zV32xn3.png)

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- [Chart.js](https://www.chartjs.org/)
- [React Hook Form](https://react-hook-form.com/)

### **Back-end**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## 🔐 Funcionalidades

- Login e cadastro com autenticação JWT
- Dashboard com KPIs (lucro líquido, km rodados, gasto com combustível)
- Filtros por dia, semana, mês e intervalo personalizado
- Registro de corridas com dados como km, valor bruto e gasto de gasolina
- Histórico com totalizadores, ordenação e exportação em PDF
- Perfil do usuário com dados do veículo e meta de lucro
- Gráficos dinâmicos
- Esqueci minha senha com redefinição de token
- Proteção de rotas no front-end
- Deploy completo via **Render** (backend) e **Vercel** (frontend)

---

## 🚀 Como rodar localmente
### Pré-requisitos
- Node.js
- MongoDB local ou remoto
- Vite (opcional para dev)

### Clonando o repositório
```bash
git clone https://github.com/PL7dev/motora-control.git
cd motora-control
```

### Backend
```bash
cd motora-control-backend
npm install
npm run dev
```
Crie um arquivo .env com:
```bash
PORT=5000
MONGO_URI=sua_conexao_mongodb
JWT_SECRET=sua_chave_jwt
```

### Frontend
```bash
cd motora-control-frontend
npm install
npm run dev
```
Crie um .env com:
```bash
VITE_API_BASE_URL=https://motora-backend.onrender.com/api
```

### Status do Projeto
🟢 Projeto funcional e em produção. Melhorias futuras incluem:
- Autenticação com refresh token
- Melhor UX com feedbacks e loading states
- Responsividade total para mobile
- Validações aprimoradas nos formulários

### 📦 Deploy
Frontend: [Vercel](https://vercel.com/)

Backend: [Render](https://render.com/)

### Autor
Feito por Pedro Lucas
[LinkedIn](https://www.linkedin.com/in/pl-alcantara/) • [GitHub](https://github.com/PL7dev)

### Licença: Este projeto está sob a licença MIT.
