import { Router } from "express";
import { MovieController } from "../controllers/movie.js";


export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router();
    const movieController = new MovieController({ movieModel })
    moviesRouter.get("/", movieController.getAll);
    moviesRouter.get("/:id", movieController.getById);
    moviesRouter.post("/", movieController.create);
    moviesRouter.patch("/:id", movieController.update);
    moviesRouter.delete("/:id", movieController.delete);
    moviesRouter.options("/", (req, res) => {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        res.send(200);
    });
    return moviesRouter;
};
