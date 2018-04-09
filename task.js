const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var _user = require('/home/joao/Documentos/libeasy/dist/models/user.js');

_user.User.findAll().then(function (users) {
  users.forEach(function (user) {
    const msg = {
      to: user.email,
      from: 'avisos@libeasy.org',
      subject: 'Aviso de atrasos',
      text: "Caro"+user.first_name+" você possui empréstimos em atraso",
      html: "Caro <strong>"+user.first_name+"</strong> você possui empréstimos em atraso"
    };
    sgMail.send(msg).then(function() {
      console.log('Message sent')
    }).catch(function(e){
      console.log('Could not send the message')
    });
  
  });
})
