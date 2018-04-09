import express from 'express';
import {BookCategory,Book,Category} from'../models/book'
import {User} from'../models/user'
import Request from 'request';
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

let router = express.Router();

router.route('/sendEmail/:user_id')
    .get((req,res)=>{
      User.findById(req.params.user_id).then(user =>{
        const msg = {
            to: user.email,
            from: 'avisos@libeasy.org',
            subject: 'Aviso de atraso',
            text: "Caro" + user.first_name +"você possui empréstimos em atraso",
            html: "Caro <strong>"+user.first_name+"</strong>, você possui empréstimos em atraso"
          };
          sgMail.send(msg).then(() => {
            res.json({message: 'Email sent'})
          }).catch(e => {
            res.json({error: 'Not possible to send the email'})
          });
      })
  })
export default router;
