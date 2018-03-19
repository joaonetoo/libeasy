import express from 'express';
import {Book} from'../models/book'

let router = express.Router();

router.route('/books')
    .get((req,res) => {
        Book.findAll().then(books =>{
            res.send(books);
        })
    })
    .post((req,res) => {
        const title = req.body.title;
        const author =  req.body.author;
        const edition = req.body.edition;
        const isnb = req.body.isnb;
        const data = {title:title, author:author,edition:edition ,isnb: isnb}
        Book.create(data).then((book) => {
            res.json({message: 'Livro adicionado'});
        })      
    })


router.route('/books/:book_id')    
    .get((req, res) => {        
        Book.findById(req.params.book_id).then(book =>{
            res.json(book);
        })    
    })
    .put((req,res) => {
        Book.findById(req.params.book_id).then(book => {
            if(book){
                book.update({title: req.body.title,
                author: req.body.author,
                edition: req.body.edition,
                isnb: req.body.isnb}).then(() => {
                    res.json(book)
                })
            }else{
                res.json({error: "Livro não encontrado"})
            }
        })
    })
    .delete((req,res) => {
        Book.findById(req.params.book_id).then(book => {
            if(book){
                book.destroy().then(book =>{
                    res.json({message: 'Livro deletado.'})
                })
            }else{
                res.json({error: 'Livro não encontrado'})
            }
        })
    })

export default router;
