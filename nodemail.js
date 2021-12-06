/****************************************************************************************************
 ****************************************************************************************************
 *                                                                                                  
 *                                              Send Email                                          
 *                                                                                                  
 ****************************************************************************************************
 *  Brief description:
 *      Send email through our outlook email.
 * 
 ****************************************************************************************************
 *  Project: TeamMe
 *  Created by: Filip Jahn
 *  Last update: 29.10.2021
 * 
 */

const nodemailer = require('nodemailer')
const { verificationMail, resetPassEmail } = require('./utils/sendEmail')


/** Mail sender details */
// var transporter = nodemailer.createTransport("SMTP", {
//     service: 'hotmail',
//     auth: {
//         user: 'teamme@outlook.cz',
//         pass: process.env.EMAIL_PASS
//     },
// })


var transporter = nodemailer.createTransport("SMTP", {
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    auth: {
        user: 'teamme@outlook.cz',
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers:'SSLv3'
    }
});

async function sendVerifiMail(email, name, host, code) {
    transporter.sendMail(
        verificationMail(email, name, host, code),
        function (err, info) {
            if (err) {
                console.log(err);
                return 0
            }
            console.log('Sending email.', info);
            return 1
        }
    )
}

async function sendResetPassMail(email, name, host, code) {
    transporter.sendMail(
        resetPassEmail(email, name, host, code),
        function (err, info) {
            if (err) {
                console.log(err);
                return 0
            }
            console.log('Sending email.', info);
            return 1
        }
    )
}

module.exports = {
    sendVerifiMail,
    sendResetPassMail
}