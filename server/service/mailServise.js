const nodemailer = require("nodemailer");

class MailServise {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {}
}

module.exports = new MailServise();
