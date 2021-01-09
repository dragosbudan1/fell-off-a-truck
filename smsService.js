const config = require('./config')

let SmsService = function () {

    // twilio setup
    const accountSid = config.get('twilio:sid')
    const authToken = config.get('twilio:authToken')
    this.client = require('twilio')(accountSid, authToken)
}

SmsService.prototype.sendSms = function (text) {
    if (config.get('sendSmsEnabled')) {
        this.client.messages
            .create({
                body: text,
                from: config.get('twilio:fromPhoneNo'),
                to: config.get('twilio:toPhoneNo')
            })
            .then(message => console.log(message.sid))
    } else {
        console.log('SMS not enabled')
    }
}

module.exports = SmsService