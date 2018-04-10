import jwt from 'jsonwebtoken';

export let checkToken = (req,res,next)=>{
    const token = req.headers['x-access-token'];
    if(token){
        jwt.verify(token,process.env.SECRETOKEN,(err,decoded)=>{
            if(err){
                res.json({error: 'User unauthorized '})
            }else{
                req.user = decoded
                next()
            }
        })
    }else{
        res.json({message:'Token not found'})
    }
}