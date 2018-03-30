import express from 'express';
import {Author} from'../models/book';
import Request from 'request';

let router = express.Router();

router.route('/authors')
    .get((req,res) => {
        Author.findAll().then( authors =>{
            res.send(authors);
        })
    })

    .post((req,res) =>{
        const name = req.body.name;
        const data = {name: name}
        Author.create(data).then(author => {
            res.json({message: 'Author adicionado'})
        })
    })

router.route('/authors/:author_id')
    .get((req,res) => {
        Author.findById(req.params.author_id).then(author =>{
            res.json(author);
        })
    })
    .put((req,res) => {
        Author.findById(req.params.author_id).then(author =>{
            if (author){
                author.update({name: req.body.name}).then(()=>{
                    res.json(author);
                })
            }else{
                res.json({error: 'Author não encontrado'})
            }
        })
    })
    .delete((req,res) => {
        Author.findById(req.params.author_id).then(author =>{
            if(author){
                author.destroy().then(author =>{
                    res.json({message: 'Author deletado'})
                })
            }else{
                res.json({error:'Author não encontrado'})
            }
        })
    })
    
export default router;
