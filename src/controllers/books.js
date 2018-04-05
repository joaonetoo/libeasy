import express from 'express';
import {Book,Category,Author} from'../models/book'
import Request from 'request';
import Sync from 'sync';
let router = express.Router();

router.route('/books')
    .get((req,res) => {
        Book.findAll().then(books =>{
            res.send(books);
        })
    })
    .post((req,res) => {
        const title = req.body.title;
        const description =  req.body.description;
        const edition = req.body.edition;
        const language = req.body.language;
        const page_count = req.body.page_count
        const data = {title:title, author:author,edition:edition ,language: language, page_count: page_count}
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
                language: req.body.language,
                page_count: req.body.page_count,}).then(() => {
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
            // let categories_translate = [];
            data_api.forEach(value => {
                // const translate_array = value.volumeInfo.categories;
                // if (!(typeof translate_array === "undefined")){
                //     categories_translate = translate_array.map(x =>{
                //         Request.get("http://localhost:3000/books/translate/"+x, (error, response, body) => {
                //             console.log(JSON.parse(body))
                //             return x  = JSON.parse(body);
                //      })
                // })

                // }
                const obj = {"api_id": value.id, 
                "title": value.volumeInfo.title,
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

router.route('/books/administrators/create')    
    .post((req,res)=>{
        Request.get("https://www.googleapis.com/books/v1/volumes?q="+req.body.api_id+"& key="+process.env.GOOGLE_BOOK_API, (error, response, body) => {
            if(error) {
                res.json({error: "livro nao encontrado"});
            }
            let body_api = JSON.parse(body);
            let data_api = body_api.items;
            let data = {};
            let categories;
            let authors;
            data_api.filter(y =>{
                if(y.id == req.body.api_id){
                    data = {
                        "api_id": y.id, 
                        "title": y.volumeInfo.title,
                        "description": y.volumeInfo.description,
                        "language": y.volumeInfo.language,
                        "page_count": y.volumeInfo.pageCount,
                        "edition": y.volumeInfo.contentVersion //contentVersion in google_api
                        
                    }
                    categories = y.volumeInfo.categories
                    authors = y.volumeInfo.authors
                }
            })

            Book.findOne({where:{api_id: data.api_id}}).then(searchBook =>{
                if(searchBook == null){
                    Book.create(data).then(book => {

                        let createCategory = function(category){
                            Category.findOne({where:{description: category}}).then(searchCategory=>{
                                if(searchCategory == null){
                                    Category.create({description: category}).then( c=>{
                                        return book.addCategory(c.id).then(() =>{})
                                    })        
                                }else{
                                    return book.addCategory(searchCategory.id).then(() =>{})
                                }
                            })
                        }

                        categories.forEach(category =>{
                            Sync(function(){
                                createCategory(category);
                            })
                        })

                        let createAuthor = function(author){
                            Author.findOne({where:{name: author}}).then(searchAuthor =>{
                                if(searchAuthor ==null){
                                    Author.create({name: author}).then(a =>{
                                        return book.addAuthor(a.id).then(()=>{})     
                                    })
                                }else{
                                    return book.addAuthor(searchAuthor.id).then(()=>{})     
                                }
                            })

                        };

                        authors.forEach(author =>{
                            Sync(function(){
                                createAuthor(author)
                            })
                        })
                        

                       res.json({message: 'Livro Cadastrado'})                      
                    })

                }else{
                    res.json({message:'Livro já existe'})
                }

            })
    
        })
    })


export default router;
