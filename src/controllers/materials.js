import express from 'express';
import { Material } from '../models/material';
import Request from 'request';
import { checkToken } from './middlewares'
import * as s from '../strings';
const fs = require('fs')
const fileType = require('file-type')

let router = express.Router();

router.use(checkToken)

router.route('/materials')
    .get((req, res) => {
        Material.findAll().then(function (materials) {
            res.json(materials);


        })
    })

    .post((req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const category = req.body.category;
        let image
        if (req.body.image){
            image = saveImage(req.body.image, req.body.name)
        }

        Material.create({ name: name, description: description, category: category,image: image }).then((materials) => {
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
                let image
                if (req.body.image){
                    image = req.body.image
                }

                material.update({
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    image: image
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
function saveImage(codigoBase64, file_name){
    var base64Data = codigoBase64.replace(/^data:image\/png;base64,/, "");
    let path = 'uploads/'+file_name+'.png'
    let img = file_name+'.png'
    require("fs").writeFile(path, base64Data, 'base64', function(err) {
        console.log(err);
    });
    return img
    }
    
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
