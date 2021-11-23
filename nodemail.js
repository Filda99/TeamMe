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
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'teamme@outlook.cz',
        pass: process.env.EMAIL_PASS
    },
})

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