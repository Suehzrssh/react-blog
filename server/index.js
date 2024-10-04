import express from 'express';
import cors from 'cors';
import postRouter from './routes/posts.js';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());




app.use('/api/post', postRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


app.listen(5000, () => {
    console.log("server is running on port 5000...");
});