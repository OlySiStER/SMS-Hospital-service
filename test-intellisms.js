var intelliSMS = require('intellisms');

var sms = new intelliSMS('smshospital', 'smsservice');

sms.SendMessage({ to: '66887575475', text: "My Text Message" }, function(err, id) {
    if (err) console.log(err);
    console.log(id);
});