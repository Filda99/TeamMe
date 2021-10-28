const nodemailer = require('nodemailer')
const path = require('path')
const verificationMail = require('./utils/sendEmail')


/** Mail sender details */
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'teamme@outlook.cz',
        pass: 't8p9@L*3sX4bkDQ&^yWlq2g'
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
        })
}

module.exports = {
    sendVerifiMail,
}