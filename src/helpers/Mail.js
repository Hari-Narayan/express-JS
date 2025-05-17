import { createTransport } from "nodemailer";

import configs from "../configs/index.js";

export default class MailHelper {
  // async..await is not allowed in global scope, must use a wrapper
  static async send({ to, subject = "", text = "", html = "" }) {
    let mailOptions = {
      to: to,
      subject,
      from: configs.MAIL_SENDER, // sender address
    };

    if (html) mailOptions.html = html;
    if (text) mailOptions.text = text;

    // list of receivers
    if (Array.isArray(to)) mailOptions.to = to.join(", ");

    try {
      const transporter = createTransport({
        host: configs.mailHost,
        port: configs.mailPort,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: configs.mailUser, // generated ethereal user
          pass: configs.mailPassword, // generated ethereal password
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail(mailOptions);
      console.info("Message sent: %s", info.messageId);
    } catch (error) {
      console.error({ error });
      throw error;
    }
  }
}
