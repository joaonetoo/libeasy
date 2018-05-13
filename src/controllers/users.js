import express from 'express';
import { User } from '../models/user';
import Request from 'request';
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import * as s from '../strings';
import multer from 'multer'
const fs = require('fs')
const fileType = require('file-type')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images/users/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

let upload = multer({ storage: storage });
let router = express.Router();
const Op = Sequelize.Op;

router.route('/users')
	.get((req, res) => {
		User.findAll().then(users => {
			res.json(users);
		})
	})

	.post(upload.single('profile_pic'), (req, res) => {
		let login = req.body.login;
		let email = req.body.email;
		let cpf = req.body.cpf;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let address = req.body.address;
		let birthday = req.body.birthday;
		let type = req.body.type;
		let profile_pic
		if (!(typeof req.file === "undefined")) {
			profile_pic = req.file.path
		}
		// login and cpf and email check
		User.findOne({
			where: {
				[Op.or]: [{ login: login },
				{ cpf: cpf },
				{ email: email }
				]
			}
		}).then(user => {
			if (user) {
				res.json({ message: s.userExists });
			}
			else {
				bcrypt.hash(req.body.password, 12).then((result) => {
					User.create({
						login: login,
						password: result,
						email: email,
						cpf: cpf,
						first_name: first_name,
						last_name: last_name,
						address: address,
						birthday: birthday,
						type: type,
						profile_pic: profile_pic
					})
						.then((u) => {
							res.json({ message: s.userAdded});
						})
				});
			}
		})
	})


router.route('/users/:user_id')
	.get((req, res) => {
		User.findById(req.params.user_id).then(user => {
			if (user) {
				res.json(user)
			}
			else {
				res.json(s.userNotFound);
			}

		})
	})
	// Modificar o usuário em caso de necessidade
	.put(upload.single('profile_pic'), (req, res) => {
		let login = req.body.login;
		let email = req.body.email;
		let cpf = req.body.cpf;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let address = req.body.address;
		let birthday = req.body.birthday;
		let type = req.body.type;
		let profile_pic
		if (!(typeof req.file === "undefined")) {
			profile_pic = req.file.path
		}else{
			if (req.body.profile_pic){
				profile_pic = savePhoto(req.body.profile_pic, req.params.user_id)
			}
		}

		User.findById(req.params.user_id).then(user => {
			if (user) {
				User.findOne({where:{login: login}}).then(findLogin=>{
					if (findLogin && user.id != findLogin.id){
						res.json({message: "Esse login já está em uso"})
					}else{
						User.findOne({where:{email: email}}).then(findEmail=>{
							if(findEmail && user.id != findEmail.id){
								res.json({message: "Esse email já existe"})
							}
							else{
								User.findOne({where:{cpf : cpf}}).then(findCpf=>{
									if(findCpf && user.id != findCpf.id){
										res.json({message: "Esse cpf já existe"})
									}
									else {
										if (!(typeof req.body.password === "undefined")) {
											// Verifica o usuário com o mesmo id depois modifica
											bcrypt.hash(req.body.password, 12).then((result) => {
												user.update({
													login: login,
													password: result,
													email: email,
													cpf: cpf,
													first_name: first_name,
													last_name: last_name,
													address: address,
													birthday: birthday,
													type: type,
													profile_pic: profile_pic
												})
													.then(() => {
														res.json({ message: s.userUpdated, user });
													})
											})
										} else {
											user.update({
												login: login,
												email: email,
												cpf: cpf,
												first_name: first_name,
												last_name: last_name,
												address: address,
												birthday: birthday,
												type: type,
												profile_pic: profile_pic
											})
												.then(() => {
													res.json({ message: s.userUpdated });
												})
					
										}
					
									}
													})
							}
						})
					}
				})


			} else {
				res.json({ message: s.userNotFound })

			}
		})

	})

	// Apagar o usuário se existir
	.delete((req, res) => {
		User.findById(req.params.user_id).then(user => {
			if (user) {
				user.destroy().then(user => {
					res.json({ message: s.userDeleted })
				}
				)
			}
			else {
				res.json({ error: s.userNotFound })
			}
		})
	})
	
function savePhoto(codigoBase64, user_id){
	var base64Data = codigoBase64.replace(/^data:image\/png;base64,/, "");
	let path = 'uploads/'+user_id+'.png'
	let img = user_id+'.png'
	require("fs").writeFile(path, base64Data, 'base64', function(err) {
	  console.log(err);
	});
	return img
	}

	
export default router;