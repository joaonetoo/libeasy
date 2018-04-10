import express from 'express';
import {Book,Category,Author,BookAuthor} from'../models/book'
import Request from 'request';
import {checkToken} from './middlewares'

let router = express.Router();

router.use(checkToken)

router.route('/books')
    .get((req,res) => {
        Book.findAll({include: [Category,Author]}).then(books =>{
              res.json(books)
        })
    })
    .post((req,res) => {
        if(req.user.type == "librarian"){
            const title = req.body.title;
            const description =  req.body.description;
            const edition = req.body.edition;
            const language = req.body.language;
            const page_count = req.body.page_count
            const data = {title:title, description:description,edition:edition ,language: language, page_count: page_count}
            Book.create(data).then((book) => {
                res.json({message: 'Book added'});
            })          
        }else{
            res.json({error:'Access denied'})
        }
    })


router.route('/books/:book_id')    
    .get((req, res) => {
        if(req.user.type == "librarian"){
            Book.findById(req.params.book_id,{include: [Category,Author]}).then(book =>{
                res.json(book)
            })        
        }else{
            res.json({error:'Access denied'})
        }
    })
    .put((req,res) => {
        if(req.user.type == "librarian"){
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
                    res.json({error: "Book not found"})
                }
            })
        }else{
            res.json({error: 'Acess denied'})
        }
    })
    .delete((req,res) => {
        if(req.user.type == "librarian"){
            Book.findById(req.params.book_id).then(book => {
                if(book){
                    book.destroy().then(book =>{
                        res.json({message: 'Book deleted.'})
                    })
                }else{
                    res.json({error: 'Book not found'})
                }
            })
        }else{
            res.json({error: 'Acess denied'})
        }
    })


router.route('/books/search/:search_id')    

    .get((req,res)=>{ 
        if(req.user.type == "librarian"){
            Request.get("https://www.googleapis.com/books/v1/volumes?q="+req.params.search_id+"& key="+process.env.GOOGLE_BOOK_API, (error, response, body) => {
                if(error) {
                    res.json({error: "Book not found"});
                }
                let body_api = JSON.parse(body);
                let data_api = body_api.items;
                let data = [];             
                // let categories_translate = [];
                data_api.forEach(value => {
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
        }else{
            res.json({error:'Access denied'})
        }
    })

router.route('/books/create')    
    .post((req,res)=>{
        if(req.user.type == "librarian"){

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
                            if (!(typeof categories === "undefined")) {
                                categories.forEach(category =>{
                                    Category.findOne({where:{description: category}}).then(searchCategory=>{
                                        if(searchCategory == null){
                                            Category.create({description: category}).then( c=>{
                                                return book.addCategory(c.id).then(() =>{})
                                            })        
                                        }else{
                                            return book.addCategory(searchCategory.id).then(() =>{})
                                        }
                                    })    
                                })
                            }
        
                            if (!(typeof authors === "undefined")) {
                                authors.forEach(author =>{
                                    Author.findOne({where:{name: author}}).then(searchAuthor =>{
                                        if(searchAuthor ==null){
                                            Author.create({name: author}).then(a =>{
                                                return book.addAuthor(a.id).then(()=>{})     
                                            })
                                        }else{
                                            return book.addAuthor(searchAuthor.id).then(()=>{})     
                                        }
                                    })                            
                                })
                            } 

                        res.json({message: 'Book added'})                      
                        })

                    }else{
                        res.json({message:'Book added'})
                    }

                })
        
            })
        }else{
            res.json({error:'Access denied'})
        }
    })



export default router;
