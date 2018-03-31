import express from 'express';
import {Material} from '../models/material';
import Request from 'request';

let router = express.Router();

router.route ('/materials')
    .get((req,res) => {
        Material.findAll().then(function(materials){
            res.send(materials);


        })
    })

    .post((req, res) =>{
        const name = req.body.name;
        const description = req.body.description;
        const category = req.body.category;
        

        Material.create({name: name, description: description, category: category}).then((materials) =>{ 
            res.json({message: "material added"});

        })
        



    });

router.route ('/materials/:id')
    .get((req, res) =>{
        Material.findById(req.params.material_id).then(material=>{ 
            res.json(material);

        })
    })

    .put((req, res) =>{
        Material.findById(req.params.material_id).then(material =>{
            if(material){
                material.update({name: req.body.name,
                                 description: req.body.description,
                                category: req.body.category}).then(() =>{
                                    res.json(material)
                                })

            }else{
                res.json({error: "Material not found"});
            }

        })
    
        .delete((req, res) =>{
            Material.findById(req.params.material).then(material => {
                if(material){

                    material.destroy().then(material => {
                        res.json({message: "Material deleted"})

                    })
                }else{
                    res.json({error: "Matrial not found"})

                }


            })


        })


    })

export default router;