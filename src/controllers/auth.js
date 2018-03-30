import express from 'express';
import {User} from'../models/user';
import Request from 'request';


let router = express.Router();
		
router.route('/auth')

	.post((req, res) => {
		User.findOne({where: {login: req.body.login}}).then((user) => {
		if (user) {
			bcrypt.compare(req.body.password,
				user.password).then((result) => {
			if (result) { // password is correct
				res.json({message: 'User authenticated'});} 
			else { // password is wrong
				res.json({message: 'Wrong password'});}
			});}
	 	else {
			res.json({message: 'User not found'});}
	});
});


export default router;