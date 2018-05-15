import jwt from 'jsonwebtoken';
import * as s from '../strings';

export let checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, "12121212", (err, decoded) => {
            if (err) {
                res.json({ error: s.userUnathorized })
            } else {
                req.user = decoded
                next()
            }
        })
    } else {
        res.json({ message: s.tokenNotFound })
    }
}