const nodemailer = require('nodemailer')

/** Mail sender details */
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth:{
        user: 'teamme@outlook.cz',
        pass: 't8p9@L*3sX4bkDQ&^yWlq2g'
    },
})

function verificationMail (email, name, host, code){
    const mailOptions = {
        from: ' "Ověřte Vaši e-mailovou adresu" <teamme@outlook.cz>',
        to: email,
        subject: 'TeamMe - Registrace uživatele',
        html: `<body style="text-align:center; backgroung">
            <h1> TeamMe - Ověření e-mailové adresy </h1>
            <h2> Ahoj ${name}! </h2>
            <p> Ověř, prosím, svoji e-mailovou adresu, aby ses mohl dostat do našeho systému.</p>
            <a href="http:${host}/user/verify-email/${code}">Přihlásit se</a>.`,
    }
    return mailOptions
}

async function sendVerifiMail(email, name, host, code){
    transporter.sendMail(
        verificationMail(email, name, host, code),
        function(err, info){
            if(err){
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