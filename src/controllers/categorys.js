import express from 'express';
import {Category} from'../models/book'
import Request from 'request';

let router = express.Router();

router.route('/categorys')
    .get((req,res) => {
        Category.findAll().then(categorys =>{
            res.send(categorys)
        })
    })

    .post((req,res) =>{
        const description = req.body.description;
        const data = {description: description}
        Category.create(data).then(category => {
            res.json({message: 'Categoria adicionada'})
        })
    })

router.route('/categorys/:category_id')
    .get((req,res) => {
        Category.findById(req.params.category_id).then(category =>{
            category.getBooks().then(b =>{
                res.json(b);
            })
        })
    })
    .put((req,res) => {
        Category.findById(req.params.category_id).then(category =>{
            if (category){
                category.update({description: req.body.description}).then(()=>{
                    res.json(category);
                })
            }else{
                res.json({error: 'Categoria não encontrada'})
            }
        })
    })
    .delete((req,res) => {
        Category.findById(req.params.category_id).then(category =>{
            if(category){
                category.destroy().then(category =>{
                    res.json({message: 'Categoria deletada'})
                })
            }else{
                res.json({error:'Categoria não encontrada'})
            }
        })
    })

export default router;
