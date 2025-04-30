const express = require('express');
const movies = require("./movies.json");
const crypto = require("node:crypto");
const { validateMovie, validatePartialMovie } = require("./schemas/movies.js");

const app = express();
const PORT = process.env.PORT ?? 3000;

// Métodos normales: GET/HEAD/POST
// Métodos complejos: PUT/PATCH/DELETE
// CORS PRE-Flight: OPTIONS

const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://movies.com",
    "https://midu.dev",
]

app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "¡Hola, mundo! 👋" });
});

app.get("/movies", (req, res) => {
    const origin = req.header("origin");
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    const { genre } = req.query;
    if(genre) {
        const filteredMovies = movies.filter((movie) => movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()));
        if(filteredMovies.length === 0) return res.status(404).json({ message: "No se encontraron películas con ese género ❌" });
        return res.json(filteredMovies);
    }
    res.json(movies);
});

app.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find((movie) => movie.id === id);
    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not found ❌" });
});

app.post("/movies", (req, res) => {
    const result = validateMovie(req.body);
    if (result.error) return res.status(422).json({ message: JSON.parse(result.error.message) });
    // En DB
    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data, // ❌ req.body
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return res.status(404).json({ message: "Movie not found ❌" });
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data,
    }
    movies[movieIndex] = updateMovie;
    res.json(updateMovie);
});

app.delete("/movies/:id", (req, res) => {
    const origin = req.header("origin");
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    const { id } = req.params;
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return res.status(404).json({ message: "Movie not found ❌" });
    movies.splice(movieIndex, 1);
    return res.json({ message: "Movie deleted successfully ✅" });
});

app.options("/movies/:id", (req, res) => {
    const origin = req.header("origin");
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.send(200);
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});