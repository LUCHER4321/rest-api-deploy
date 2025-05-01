import { createApp } from "../app.js";
import { MovieModel } from "../models/mysql/movie.js";

export const deployServer = () => createApp({ movieModel: MovieModel });