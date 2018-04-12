import express from 'express';
import { Material } from '../models/material';
import Request from 'request';
import { checkToken } from './middlewares'
import * as s from '../strings';

let router = express.Router();

router.use(checkToken)

router.route('/materials')
    .get((req, res) => {
        Material.findAll().then(function (materials) {
            res.send(materials);


        })
    })

    .post((req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const category = req.body.category;

        Material.create({ name: name, description: description, category: category }).then((materials) => {
            res.json({ message: s.materialAdded });

        });
    });

router.route('/materials/:material_id')
    .get((req, res) => {
        Material.findById(req.params.material_id).then(material => {
            if(material){
            res.json(material);
            }else{
                res.json({message: s.materialNotFound})
            }
        })
    })

    .put((req, res) => {
        Material.findById(req.params.material_id).then(material => {
            if (material) {
                material.update({
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category
                }).then(() => {
                    res.json(material);
                })
            } else {
                res.json({ error: s.materialNotFound })
            };
        });
    })

    .delete((req, res) => {
        Material.findById(req.params.material_id).then(material => {
            if (material) {
                material.destroy().then((material => {
                    res.json({ message: s.materialDeleted });
                }))
            } else {
                res.json({ error: s.materialNotFound });
            }
        })
    });

export default router;

        // })

    // .put((req, res) =>{
    //     Material.findById(req.params.material_id).then(material =>{
    //         if(material){
    //             material.update({name: req.body.name,
    //                              description: req.body.description,
    //                             category: req.body.category}).then(() =>{
    //                                 res.json(material)
    //                             })

    //         }else{
    //             res.json({error: "Material not found"});
    //         }

    //     })

    //     .delete((req, res) =>{
    //         Material.findById(req.params.material_i).then(material => {
    //             if(material){

    //                 material.destroy().then(material => {
    //                     res.json({message: "Material deleted"})

    //                 })
    //             }else{
    //                 res.json({error: "Matrial not found"})

    //             }


    //         })


    //     })


    // })
