import express from 'express';
import {BookAuthor,Book,Author} from'../models/book';
import Request from 'request';
import {checkToken} from './auth'

let router = express.Router();

router.use(checkToken)

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
            res.json({message: 'Author added'})
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
                res.json({error: 'Author not found'})
            }
        })
    })
    .delete((req,res) => {
        Author.findById(req.params.author_id).then(author =>{
            if(author){
                author.destroy().then(author =>{
                    res.json({message: 'Author deleted'})
                })
            }else{
                res.json({error:'Author not found'})
            }
        })
    })
    
router.route('/addAuthorToBook')
    .post((req,res)=>{
        Book.findById(req.body.bookId).then(book=>{
            if(book){
                Author.findById(req.body.authorId).then(author=>{
                    if(author){
                        book.addAuthor(author).then(()=>{
                            res.json({message:'Author added in the book'})
                        })
                    }else{
                        res.json({error:'Author not found'})
                    }
                })
            }else{
                res.json({error:'Book not found'})
            }
        })
    })

router.route('/removeAuthorToBook')
    .delete((req,res)=>{
        BookAuthor.findOne({where: {bookId:req.body.bookId,authorId:req.body.authorId}})
        .then(bookAuthor=>{
            if(bookAuthor){
                bookAuthor.destroy().then(()=>{
                    res.json({message: 'Author deleted of the book'})
                })
            }else{
                res.json({error: 'Author not associate to the book'})
            }
                
        })
    })
export default router;
