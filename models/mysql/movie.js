import mysql from 'mysql2/promise';
import { config } from "dotenv";

config("./.env");

const configSQL = {
    host: process.env.MYSQL_HOST ?? 'localhost',
    user: process.env.MYSQL_USER ?? 'root',
    port: process.env.MYSQL_PORT ?? 3306,
    password: process.env.MYSQL_PASSWORD ?? '',
    database: process.env.MYSQL_DATABASE ?? 'moviesdb',
}

const connection = await mysql.createConnection(configSQL);

const getGenresByMovie = async ({ id }) => {
    const [genres] = await connection.query(
        "SELECT name FROM genre, movie_genres WHERE movie_id = UUID_TO_BIN(?) AND genre_id = id GROUP BY id;",
        [id]
    );
    return genres.map(genre => genre.name);
};

const movieFormat = (movie) => {
    return {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        director: movie.director,
        duration: movie.duration,
        poster: movie.poster,
        rate: Number(movie.rate),
    };
};

export class MovieModel {
    static getAll = async ({ genre }) => {
        if(genre){
            const lowerCaseGenre = genre.toLowerCase();
            const [genres] = await connection.query(
                'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
                [lowerCaseGenre]
            );
            if (genres.length === 0) return [];
            const [{ id }] = genres;
            const [movies] = await connection.query(
                'SELECT BIN_TO_UUID(movie.id) id, title, year, director, duration, poster, rate FROM movie, movie_genres WHERE movie_genres.genre_id = ? AND id = movie_id GROUP BY id;',
                [id]
            );
            const moviesWithGenres = movies.map(async movie => ({
                ...movie,
                genre: await getGenresByMovie({ id: movie.id }),
            }));
            return Promise.all(moviesWithGenres);
        }
        const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie;');
        const moviesWithGenres = movies.map(async movie => ({
            ...movieFormat(movie),
            genre: await getGenresByMovie({ id: movie.id }),
        }));
        return Promise.all(moviesWithGenres);
    }

    static getById = async ({ id }) => {
        const [movies] = await connection.query(
            'SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
            [id]
        );
        if (movies.length === 0) return null;
        return {
            ...movieFormat(movies[0]),
            genre: await getGenresByMovie({ id }),
        };
    }

    static create = async ({ input }) => {
        const {
            genre: genreInput,
            title,
            year,
            director,
            duration,
            rate,
            poster,
        } = input;
        const [uuidResult] = await connection.query("SELECT UUID() uuid;");
        const [{ uuid }] = uuidResult;
        try{
            await connection.query(
                "INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);",
                [uuid, title, year, director, duration, poster, rate]
            );
        } catch(e){
            throw new Error("Error creating movie");
        }
        for(const g of genreInput){
            try{
                await connection.query(
                    "INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), (SELECT id FROM genre WHERE name = ?));",
                    [uuid, g]
                );
            } catch(e){
                throw new Error("Error creating movie genre");
            }
        }
        const [movies] = await connection.query(
            "SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);",
            [uuid]
        );
        return {
            ...movieFormat(movies[0]),
            genre: await getGenresByMovie({ id }),
        };
    }

    static delete = async ({ id }) => {
        const [result] = await connection.query(
            "DELETE FROM movie WHERE id = UUID_TO_BIN(?);",
            [id]
        );
        if (result.affectedRows === 0) return false;
        return true;
    }

    static update = async ({ id, input }) => {
        const { genre: genreInput, ...rest } = input;
        const [result] = await connection.query(
            "UPDATE movie SET ? WHERE id = UUID_TO_BIN(?);",
            [rest, id]
        );
        if (result.affectedRows === 0) return false;
        const [movies] = await connection.query(
            "SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);",
            [id]
        );
        return {
            ...movieFormat(movies[0]),
            genre: await getGenresByMovie({ id }),
        };
    }
}