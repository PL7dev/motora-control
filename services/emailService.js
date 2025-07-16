const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia e-mail com o link de recuperação
 * @param {string} to - destinatário
 * @param {string} link - link de redefinição de senha
 */
async function enviarEmailRecuperacao(to, link) {
  const mailOptions = {
    from: `"Suporte Motora Control" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Recuperação de Senha - Uber Control',
    html: `
      <h2>Recuperação de Senha</h2>
      <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova:</p>
      <a href="${link}" target="_blank">${link}</a>
      <p>Se você não solicitou isso, ignore este e-mail.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmailRecuperacao };
