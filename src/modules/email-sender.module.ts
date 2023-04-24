import sgMail from '@sendgrid/mail';
import config from '../config';

const DOMAIN = config.app.domain;
const SENDGRID_TEMPLATE_ID = config.sendgrid.templateId;

sgMail.setApiKey(config.sendgrid.apiKey);

export default class EmailSender {
  static async sendByTemplate(to: string, templateId: string, templateData: Record<string, string>) {
    return new Promise((resolve, reject) => {
      sgMail
        .send({
          to,
          from: 'zero5011@gmail.com',
          templateId,
          dynamicTemplateData: templateData,
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    })
  }

  static async sendVerificationEmail(email: string, verificationCode: string) {
    await EmailSender.sendByTemplate(email, SENDGRID_TEMPLATE_ID, {
      'verification_url': `${DOMAIN}/auth/email-verification?code=${verificationCode}`,
    });
  }
}