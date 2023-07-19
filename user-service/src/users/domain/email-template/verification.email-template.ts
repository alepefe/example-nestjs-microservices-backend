
import { EmailRecepients } from '../../../shared/domain/email-template/email-recepients';
import { EmailTemplate } from '../../../shared/domain/email-template/email-template';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { VerificationCodeCode } from '../../../users/domain/verification-code/verification-code-code.value-object';

function factory (params: { from: EmailAddress, to: EmailRecepients, code: VerificationCodeCode }): EmailTemplate {
  return {
    templateName: 'verify_email',
    from: params.from,
    to: params.to,
    subject: '✉ Verificación de email',
    body: `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="format-detection" content="telephone=no">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <title>Email Template</title>
      <!--[if mso]>
      <style>
        table {border-collapse: collapse;}
        .mso-fix {font-size:0!important; line-height:0!important;}
      </style>
      <![endif]-->
      <style>
        /* CSS styles */
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          padding: 20px;
        }
        .logo {
          display: block;
          margin: 0 auto;
        }
        .brand {
          margin-bottom: 20px;
          font-family: 'Poppins', Arial, sans-serif;
          font-weight: 700;
          color: #646464;
          font-size: 18px;
        }
        .message {
          font-family: 'Poppins', Arial, sans-serif;
          font-size: 16px;
          color: #646464;
          margin-top: 20px;
        }
        .code {
          font-family: 'Poppins', Arial, sans-serif;
          font-size: 16px;
          color: #646464;
          margin-top: 20px;
          letter-spacing: 0.3rem;
          white-space: nowrap;
        }
      </style>
      <!--[if mso]>
      <style>
        .container {
          width: 100% !important;
        }
      </style>
      <![endif]-->
    </head>
    <body>
      <div class="container">
        <p class="brand">
          <img class="logo" src="https://XXXXXXXXXXXXXXXXXXXXXXXXXx alt="Logo" height="48" style="display:block;margin:0 auto;" />
        </p>
        <p class="message">Enter the following code in the app to verify you email</p>
        <b class="code">${params.code.value}</b>
      </div>
    </body>
    </html>
    
    `
  };
}

const VerificationEmailEmailTemplate = {
  factory
} as const;

export default VerificationEmailEmailTemplate;
