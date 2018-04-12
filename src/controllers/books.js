import express from 'express';
import { Book, Category, Author, BookAuthor } from '../models/book'
import Request from 'request';
import { checkToken } from './middlewares'
import multer from 'multer'
import * as s from '../strings'

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/images/books/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

let upload = multer({ storage: storage });

let router = express.Router();

router.use(checkToken)

router.route('/books')
    .get((req, res) => {
        Book.findAll({ include: [Category, Author] }).then(books => {
            res.json(books)
        })
    })
    .post(upload.single('image'), (req, res) => {
        if (req.user.type == "librarian") {
            const title = req.body.title;
            const description = req.body.description;
            const edition = req.body.edition;
            const language = req.body.language;
            const page_count = req.body.page_count
            let image
            if (!(typeof req.file === "undefined")) {
                image = req.file.path
            }
            const data = { title: title, description: description, edition: edition, language: language, page_count: page_count, image: image }
            Book.create(data).then((book) => {
                res.json({ message: s.bookAdded });
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })


router.route('/books/:book_id')
    .get((req, res) => {
        if (req.user.type == "librarian") {
            Book.findById(req.params.book_id, { include: [Category, Author] }).then(book => {
                res.json(book)
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })
    .put(upload.single('image'), (req, res) => {
        if (req.user.type == "librarian") {
            Book.findById(req.params.book_id).then(book => {
                if (book) {
                    const title = req.body.title;
                    const description = req.body.description;
                    const edition = req.body.edition;
                    const language = req.body.language;
                    const page_count = req.body.page_count
                    let image
                    if (!(typeof req.file === "undefined")) {
                        image = req.file.path
                    }

                    const data = { title: title, description: description, edition: edition, language: language, page_count: page_count, image: image }
                    book.update(data).then(() => {
                        res.json(book)
                    })
                } else {
                    res.json({ error: s.bookNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })
    .delete((req, res) => {
        if (req.user.type == "librarian") {
            Book.findById(req.params.book_id).then(book => {
                if (book) {
                    book.destroy().then(book => {
                        res.json({ message: s.bookDeleted })
                    })
                } else {
                    res.json({ error: s.bookNotFound })
                }
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })


router.route('/books/search/:search_id')

    .get((req, res) => {
        if (req.user.type == "librarian") {
            Request.get("https://www.googleapis.com/books/v1/volumes?q=" + req.params.search_id + "& key=" + process.env.GOOGLE_BOOK_API, (error, response, body) => {
                if (error) {
                    res.json({ error: s.bookNotFound });
                }
                let body_api = JSON.parse(body);
                let data_api = body_api.items;
                let data = [];
                // let categories_translate = [];
                data_api.forEach(value => {
                    const obj = {
                        "api_id": value.id,
                        "title": value.volumeInfo.title,
                        "authors": value.volumeInfo.authors,
                        "description": value.volumeInfo.description,
                        "language": value.volumeInfo.language,
                        "pageCount": value.volumeInfo.pageCount,
                        "categories": value.volumeInfo.categories,
                        "edition": value.volumeInfo.contentVersion, //contentVersion in google_api
                        "images": value.volumeInfo.imageLinks
                    }
                    data.push(obj);

                })
                res.json(data);
            });
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })

router.route('/books/create')
    .post((req, res) => {
        if (req.user.type == "librarian") {

            Request.get("https://www.googleapis.com/books/v1/volumes?q=" + req.body.api_id + "& key=" + process.env.GOOGLE_BOOK_API, (error, response, body) => {
                if (error) {
                    res.json({ error: s.bookNotFound });
                }
                let body_api = JSON.parse(body);
                let data_api = body_api.items;
                let data = {};
                let categories;
                let authors;
                data_api.filter(y => {
                    if (y.id == req.body.api_id) {
                        data = {
                            "api_id": y.id,
                            "title": y.volumeInfo.title,
                            "description": y.volumeInfo.description,
                            "language": y.volumeInfo.language,
                            "page_count": y.volumeInfo.pageCount,
                            "edition": y.volumeInfo.contentVersion, //contentVersion in google_api
                            "image": y.volumeInfo.imageLinks.thumbnail,
                            "image_thumbnail": y.volumeInfo.imageLinks.smallThumbnail
                        }
                        categories = y.volumeInfo.categories
                        authors = y.volumeInfo.authors
                    }
                })

                Book.findOne({ where: { api_id: data.api_id } }).then(searchBook => {
                    if (searchBook == null) {
                        Book.create(data).then(book => {
                            if (!(typeof categories === "undefined")) {
                                categories.forEach(category => {
                                    Category.findOne({ where: { description: category } }).then(searchCategory => {
                                        if (searchCategory == null) {
                                            Category.create({ description: category }).then(c => {
                                                return book.addCategory(c.id).then(() => { })
                                            })
                                        } else {
                                            return book.addCategory(searchCategory.id).then(() => { })
                                        }
                                    })
                                })
                            }

                            if (!(typeof authors === "undefined")) {
                                authors.forEach(author => {
                                    Author.findOne({ where: { name: author } }).then(searchAuthor => {
                                        if (searchAuthor == null) {
                                            Author.create({ name: author }).then(a => {
                                                return book.addAuthor(a.id).then(() => { })
                                            })
                                        } else {
                                            return book.addAuthor(searchAuthor.id).then(() => { })
                                        }
                                    })
                                })
                            }

                            res.json({ message: s.bookAdded })
                        })
                    } else {
                        res.json({ message: s.bookExists })
                    }
                })
            })
        } else {
            res.json({ error: s.globalAccessDenied })
        }
    })



export default router;
