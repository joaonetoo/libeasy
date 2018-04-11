const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var _user = require('./dist/models/user.js');
var _loan = require('./dist/models/loan.js');
var _reservation = require('./dist/models/reservation.js');

_user.User.findAll().then(function (users) {
  users.forEach(function (user) {
    _loan.Loan.findAll({where:{userId: user.id, delivered: false}}).then(function(loans){
      loans.forEach(function(loan){
        if(validateLoan(loan.final_date)){
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
        }
      })
    })
  });
})

_reservation.Reservation.findAll().then(function(reservations){
  reservations.forEach(function(reservation){
    if (validateReservation(reservation.date)){
      reservation.update({expired: true}).then(()=>{
        console.log('change expired to true');
      })
    }
  })
})

function validateReservation(date){
  var yourDate = date
  var dateNow  = new Date()
  var millisecondsPerDay = 86400000;
	var diff = Math.round(dateNow - yourDate)/(millisecondsPerDay);
  if (diff.get >= 2 ){
      return true
  }else{
      return false
  }
}

function validateLoan(date){
  var yourDate = date
  var dateNow  = new Date('2018-04-13')
  var millisecondsPerDay = 86400000;
	var diff = Math.round(dateNow - yourDate)/(millisecondsPerDay);
  if (diff > 0 ){
      return true
  }else{
      return false
  }
}