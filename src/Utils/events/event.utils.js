import { EventEmitter } from "events";
import { emailSubject, sendEmail } from "../email/sendEmail.utils.js";
import { templete } from "../email/generateHtml.js";
const today = new Date();
const formattedDate =
  today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

export const emailEvent = new EventEmitter();
emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.confirmEmail,

    html: templete(data.code, data.firstName, formattedDate),
  });
});
emailEvent.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubject.resetPassword,
    html: templete(data.code, data.firstName, formattedDate,emailSubject.resetPassword),
  });
});
