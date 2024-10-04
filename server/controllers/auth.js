import {db} from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const regiser = (req, res) => {
    //checkiing users

    const q = 'SELECT * FROM usersinfo WHERE username = ? OR email = ?';

    db.query(q, [req.body.username, req.body.email],
        (err, result) => {
            if(err) return res.json(err);
            if(result.length) return res.status(409).json('user already exists');

            //hashing password
            const saltRounds = 10;
            const myPlaintextPassword = req.body.password;

            bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
                const q = `INSERT INTO usersinfo (username, email, password) VALUES (?,?,?);`;
            //creating user
            
            db.query(q, [req.body.username, req.body.email, hash], (err, data) => {
                if(err) {
                    return res.json(err)
                }else {
                    res.status(200).json("user is created");
                }

                
            });
            
            });

            
        }
    );
};

export const login = (req, res) => {
    //checking user
    const q = "SELECT * FROM usersinfo WHERE username = ?";

    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.json(err);
        if(data.length === 0) return res.status(404).json('user is not found!');

        //checking password
        const isPasswordCorrect = bcrypt.compare(req.body.password, data[0].password);

        if(!isPasswordCorrect) return res.status(400).json('wrong username or password');


        const token = jwt.sign({id: data[0].id}, "jwtkey");
        const {password, ...other} = data[0];
        res.cookie("accessToken", token, {
            httpOnly: true
        }).status(200).json(other);
    });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        samSite: "none",
        secure: true
    }).status(200).json('user loggedOut');
};