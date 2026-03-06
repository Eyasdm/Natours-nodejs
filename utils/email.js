const pug = require('pug');
const htmlToText = require('html-to-text');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  async send(template, subject) {
    try {
      // 1️ Render HTML from pug template
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject,
        },
      );

      // 2️ Send email with Resend
      const result = await resend.emails.send({
        from: this.from,
        to: this.to,
        subject: subject,
        html: html,
        text: htmlToText.convert(html),
      });

      return result;
    } catch (err) {
      console.error('❌ Email sending failed:', err);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 min)',
    );
  }
};
