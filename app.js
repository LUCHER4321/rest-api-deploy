import express, { json } from 'express';
import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

export const createApp = ({ movieModel }) => {
    const app = express();
    
    app.disable("x-powered-by");
    
    app.use(json());
    
    app.use(corsMiddleware());
    
    app.get("/", (req, res) => {
        res.json({ message: "¡Hola, mundo! 👋" });
    });
    
    app.use("/movies", createMovieRouter({ movieModel }));
    return app;
};