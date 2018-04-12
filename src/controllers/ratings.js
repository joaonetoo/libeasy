import express from 'express';
import { Rating } from '../models/rating';
import Request from 'request';
import { checkToken } from './middlewares'
import { User } from '../models/user';
import { Book } from '../models/book';
import * as s from '../strings';

let router = express.Router();
router.use(checkToken)

router.route('/ratings')
    .get((req, res) => {
        Rating.findAll({ include: [Book, User] }).then(function (ratings) {
            res.json(ratings);
        })
    })

    .post((req, res) => {
        const userId = req.body.userId;
        const bookId = req.body.bookId;
        const star = req.body.star;
        const comment = req.body.comment;

        User.findById(userId).then(user =>{
            if(!user){
                res.json({ message: s.userNotFound });
            }else{
                Book.findById(bookId).then(book =>{
                    if(!book){
                        res.json({ message: s.bookNotFound });
                    }else{
                        Rating.create({ userId, bookId, star, comment }).then((ratings) => {
                            User.findById(userId).then(user => {
                                res.json({ message: s.ratingAdded });
                            })
                        })
                    }
                })
            }
        })
    });

router.route('/ratings/:id_rating')
    .get((req, res) => {
        Rating.findById(req.params.id_rating).then(rating => {
            if(rating){
            res.json(rating);
            }else{
                res.json({message: s.ratingNotFound})
            }
        })
    })

    .put((req, res) => {
        Rating.findById(req.params.id_rating).then(rating => {
            if (rating) {
                rating.update({
                    userId: req.body.userId,
                    bookId: req.body.bookId,
                    star: req.body.star,
                    comment: req.body.comment
                }).then(() => {
                    res.json({message: s.ratingUpdated ,rating})
                })
            } else {
                res.json({ error: s.ratingNotFound });
            }

        })
    })
    .delete((req, res) => {
        Rating.findById(req.params.id_rating).then(rating => {
            if (rating) {

                rating.destroy().then(rating => {
                    res.json({ message: s.ratingDeleted })

                })
            } else {
                res.json({ error: s.ratingNotFound })

            }
        })
    })

export default router;