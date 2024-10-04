import {db} from '../db.js';
import jwt from 'jsonwebtoken';

export const getPost = (req, res) => {
    const q = req.query.cat ? 
    'SELECT * FROM postsinfo WHERE cat = ?' :
    'SELECT * FROM postsinfo';

    db.query(q, [req.query.cat], (err, data) => {
        if(err) return res.json(err);

        return res.status(200).json(data);
    });
}

export const getSinglePost = (req, res) => {
    const q = "SELECT p.id, title, description, date, image, cat FROM postsinfo p WHERE p.id = ?";

    db.query(q, [req.params.id], (err, data) => {
        if(err) return res.json(err);

        return res.status(200).json(data[0]);
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json('not authenticated User!');

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.json("token is not valid");

        const q = "INSERT INTO postsinfo (title, description, image, date, uid, cat) VALUES(?)";
        const values = [
            req.body.title,
            req.body.description,
            req.body.image,
            req.body.date,
            req.body.cat,
            userInfo.id,
        ]
        db.query(q, [values], (err, data) => {
            if(err) return res.json(err);

            return res.json('post is created');
        });
    });
}

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json('not authenticated User!');

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.json("token is not valid");

        const postId = req.params.id;
        const q = "DELETE FROM postsinfo WHERE `id` = ? AND `uid` = ?;";

        db.query(q, [postId, userInfo.id], (err, data) => {
            if(err) return res.json('you can delete your own posts');

            return res.json("post is deleted");
        });
    });
}

export const updatePost = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json('not authenticated User!');

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if(err) return res.json("token is not valid");

        const postId = req.params.id;
        const q = "UPDATE postsinfo SET `title`=?, `description`=?, `image`=?, `cat`=? WHERE `id`=? AND `uid`=?";
        const values = [
            req.body.title,
            req.body.description,
            req.body.image,
            req.body.cat,
        ]
        db.query(q, [...values, postId, userInfo.id], (err, data) => {
            if(err) return res.json(err);

            return res.json('post is updated');
        })
    });
}