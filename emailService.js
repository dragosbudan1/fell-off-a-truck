const nodemailer = require('nodemailer')
const config = require('./config')

var EmailService = function() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: config.get('mail:fromEmail'),
            pass: config.get('mail:fromPassword')
        }
    })
}

EmailService.prototype.sendEmail = function(mailText){
    if (config.get('sendEmailEnabled')) {

        let mailOptions = {
            from: config.get('mail:fromEmail'),
            to: config.get('mail:toEmail'),
            subject: 'Wiggle Basket Available',
            text: `${JSON.stringify(mailText)}`
        }

        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
    } else {
        console.log('Email not enabled')
    }
}

module.exports = EmailService