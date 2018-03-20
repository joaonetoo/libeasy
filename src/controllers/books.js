import express from 'express';
import {Book} from'../models/book'
import Request from 'request';
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
router.route('/books/administrators/search/:search_id')    
    .get((req,res)=>{ 
        Request.get("https://www.googleapis.com/books/v1/volumes?q="+req.params.search_id+"& key="+process.env.GOOGLE_BOOK_API, (error, response, body) => {
            if(error) {
                res.json({error: "livro nao encontrado"});
            }
            let body_api = JSON.parse(body);
            let data_api = body_api.items;
            let data = [];
            data_api.forEach(value => {
                const obj = {"api_id": value.id, 
                "title": value.volumeInfo.title,
                "subtitle": value.volumeInfo.subtitle,
                "authors": value.volumeInfo.authors,
                "description": value.volumeInfo.description,
                "language": value.volumeInfo.language,
                "pageCount": value.volumeInfo.pageCount,
                "categories": value.volumeInfo.categories,
                "edition": value.volumeInfo.contentVersion, //contentVersion in google_api
                }
                data.push(obj);
            
            })
            res.json(data);
        });  
    })
router.route('/books/administrators/create/:search_id')    
    .get((req,res)=>{
        Request.get("https://www.googleapis.com/books/v1/volumes?q="+req.params.search_id+"& key="+process.env.GOOGLE_BOOK_API, (error, response, body) => {
            if(error) {
                res.json({error: "livro nao encontrado"});
            }
            let body_api = JSON.parse(body);
            let data_api = body_api.items;
            let data = {};
            let results = data_api.filter(y =>{
                if(y.id == req.params.search_id){
                    data = {
                        "api_id": y.id, 
                        "title": y.volumeInfo.title,
                        "subtitle": y.volumeInfo.subtitle,
                        "description": y.volumeInfo.description,
                        "language": y.volumeInfo.language,
                        "pageCount": y.volumeInfo.pageCount,
                        "edition": y.volumeInfo.contentVersion //contentVersion in google_api
                    }
                }
            })  
            Book.create(data).then((book) => {
                res.json({message: 'Livro adicionado'});
            })      
        })
    })

export default router;
