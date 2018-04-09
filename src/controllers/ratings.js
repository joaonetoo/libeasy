import express from 'express';
import {Rating} from '../models/rating';
import Request from 'request';

let router = express.Router();

router.route ('/ratings')
    .get((req,res) => {
        Rating.findAll().then(function(ratings){
            res.send(ratings);
        })
    })

    .post((req, res) =>{
        const star = req.body.star;
        const comment = req.body.comment;
        

        Rating.create({star,comment}).then((ratings) =>{ 
            res.json({message: "rating added"});
        })
    });

router.route ('/ratings/:id_rating')
    .get((req, res) =>{
        Rating.findById(req.params.id_rating).then(rating=>{ 
            res.json(rating);
        })
    })

    .put((req, res) =>{
        Rating.findById(req.params.id_rating).then(rating =>{
            if(rating){
                rating.update({star: req.body.star,
                                comment: req.body.comment}).then(() =>{
                                    res.json(rating)
                                })
            }else{
                res.json({error: "rating not found"});
            }

        })
    })
    .delete((req, res) =>{
        Rating.findById(req.params.id_rating).then(rating => {
            if(rating){

                rating.destroy().then(rating => {
                    res.json({message: "rating deleted"})

                })
            }else{
                res.json({error: "rating not found"})

            }
        })
    })

export default router;