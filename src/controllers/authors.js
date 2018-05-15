import express from 'express';
import { BookAuthor, Book, Author } from '../models/book';
import Request from 'request';
import { checkToken } from './middlewares'
import * as s from '../strings'

let router = express.Router();

router.use(checkToken)

router.route('/authors')
    .get((req, res) => {
        Author.findAll().then(authors => {
            res.send(authors);
        })
    })

    .post((req, res) => {
        const name = req.body.name;
        const data = { name: name }
        Author.create(data).then(author => {
            res.json({ message: s.authorAdded, object: author })
        })
    })


router.route('/authors/:author_id')
    .get((req, res) => {
        Author.findById(req.params.author_id).then(author => {
            res.json(author);
        })
    })
    .put((req, res) => {
        if (req.user.type == "librarian") {
            Author.findById(req.params.author_id).then(author => {
                if (author) {
                    author.update({ name: req.body.name }).then(() => {
                        res.json(author);
                    })
                } else {
                    res.json({ error: s.authorNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })
    .delete((req, res) => {
        if (req.user.type == "librarian") {

            Author.findById(req.params.author_id).then(author => {
                if (author) {
                    author.destroy().then(author => {
                        res.json({ message: s.authorDeleted })
                    })
                } else {
                    res.json({ error: s.authorNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })

router.route('/addAuthorToBook')

    .post((req, res) => {
        if (req.user.type == "librarian") {

            Book.findById(req.body.bookId).then(book => {
                if (book) {
                    Author.findById(req.body.authorId).then(author => {
                        if (author) {
                            book.addAuthor(author).then(() => {
                                res.json({ message: s.authorAddedInBook })
                            })
                        } else {
                            res.json({ error: s.authorNotFound })
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

router.route('/removeAuthorToBook')
    .delete((req, res) => {
        if (req.user.type == "librarian") {
            BookAuthor.findOne({ where: { bookId: req.body.bookId, authorId: req.body.authorId } })
                .then(bookAuthor => {
                    if (bookAuthor) {
                        bookAuthor.destroy().then(() => {
                            res.json({ message: s.authorDeletedFromBook })
                        })
                    } else {
                        res.json({ error: s.authorNotAssociated })
                    }

                })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })

export default router;
