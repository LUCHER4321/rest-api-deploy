import { randomUUID } from "node:crypto";
import { readJSON } from "../utils.js";

const movies = readJSON("./movies.json");

export class MovieModel {
    static getAll = async ({ genre }) => {
        if(genre) return movies.filter(
            movie => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
        );
        return movies;
    }

    static getById = async ({ id }) => {
        const movie = movies.find(movie => movie.id === id);
        return movie;
    }

    static create = async ({ input }) => {
        const newMovie = {
            id: randomUUID(), // uuid v4
            ...input, // ❌ req.body
        };
        movies.push(newMovie);
        return newMovie;
    }

    static delete = async ({ id }) => {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex === -1) return false;
        movies.splice(movieIndex, 1);
        return true;
    }

    static update = async ({ id, input }) => {
        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex === -1) return false;
        const updateMovie = {
            ...movies[movieIndex],
            ...input,
        };
        movies[movieIndex] = updateMovie;
        return updateMovie;
    }
}