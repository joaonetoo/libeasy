import express from 'express';
import {BookCategory,Book,Category} from'../models/book'
import Request from 'request';
import {checkToken} from './auth'

let router = express.Router();

router.use(checkToken)

router.route('/categories')
    .get((req,res) => {
        Category.findAll().then(categories =>{
            res.send(categories)
        })
    })

    .post((req,res) =>{
        const description = req.body.description;
        const data = {description: description}
        Category.create(data).then(category => {
            res.json({message: 'Category added'})
        })
    })

router.route('/categories/:category_id')
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
                res.json({error: 'Category not found'})
            }
        })
    })
    .delete((req,res) => {
        Category.findById(req.params.category_id).then(category =>{
            if(category){
                category.destroy().then(category =>{
                    res.json({message: 'Category deleted'})
                })
            }else{
                res.json({error:'Category not found'})
            }
        })
    })

router.route('/addCategoryToBook')
    .post((req,res)=>{
        Book.findById(req.body.bookId).then(book =>{
            if(book){
                Category.findById(req.body.categoryId).then(category =>{
                    if(category){
                        book.addCategory(category).then(()=>{
                            res.json({message: 'Category added in the book'})
                        })
                    }else{
                        res.json({error: 'Category not found'})
                    }
                })
            }else{
                res.json({error: 'Book not found'})
            }
        })
                
    })
router.route('/removeCategoryToBook')
    .delete((req,res)=>{
        BookCategory.findOne({where:{bookId:req.body.bookId,categoryId:req.body.categoryId}})
        .then(bookCategory=>{
            if(bookCategory){
                bookCategory.destroy().then(()=>{
                    res.json({message:'Category deleted of the book'})
                })
            }else{
                res.json({error: 'Category not associate to the book'})
            }
            
        })
    })

export default router;
