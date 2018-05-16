import express from 'express';
import { BookCategory, Book, Category } from '../models/book'
import Request from 'request';
import { checkToken } from './middlewares'
import * as s from '../strings'

let router = express.Router();

router.use(checkToken)

router.route('/categories')
    .get((req, res) => {
        Category.findAll().then(categories => {
            res.send(categories)
        })
    })

    .post((req, res) => {
        if (req.user.type == "librarian") {
            const description = req.body.description;
            const data = { description: description }
            Category.findOne({where: {description: req.body.description}})
            .then(category => {
                if(category) {
                    res.json({error: "Categoria ja existe!", object: category})
                } else {
                    Category.create(data).then(category => {
                        res.json({ message: s.categoryAdded, object: category })
                    })
                }
            })
                
            } else {
                res.json({ error: s.globalAccessDenied })
            }
    })

router.route('/categories/:category_id')
    .get((req, res) => {
        Category.findById(req.params.category_id).then(category => {
            category.getBooks().then(b => {
                res.json(b);
            })
        })
    })
    .put((req, res) => {
        if (req.user.type == "librarian") {
            Category.findById(req.params.category_id).then(category => {
                if (category) {
                    category.update({ description: req.body.description }).then(() => {
                        res.json(category);
                    })
                } else {
                    res.json({ error: s.categoryNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })
    .delete((req, res) => {
        if (req.user.type == "librarian") {
            Category.findById(req.params.category_id).then(category => {
                if (category) {
                    category.destroy().then(category => {
                        res.json({ message: s.categoryDeleted })
                    })
                } else {
                    res.json({ error: s.categoryNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })

router.route('/addCategoryToBook')
    .post((req, res) => {
        if (req.user.type == "librarian") {
            Book.findById(req.body.bookId).then(book => {
                if (book) {
                    Category.findById(req.body.categoryId).then(category => {
                        if (category) {
                            book.addCategory(category).then(() => {
                                res.json({ message: s.categoryAddedInBook })
                            })
                        } else {
                            res.json({ error: s.categoryNotFound })
                        }
                    })
                } else {
                    res.json({ error: s.bookNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })
router.route('/removeCategoryToBook')
    .delete((req, res) => {
        if (req.user.type == "librarian") {
            BookCategory.findOne({ where: { bookId: req.body.bookId, categoryId: req.body.categoryId } })
                .then(bookCategory => {
                    if (bookCategory) {
                        bookCategory.destroy().then(() => {
                            res.json({ message: s.categoryDeletedFromBook })
                        })
                    } else {
                        res.json({ error: s.categoryNotAssociated })
                    }

                })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })

export default router;
