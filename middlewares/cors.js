import cors from "cors";

const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://movies.com",
    "https://midu.dev",
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        if(acceptedOrigins.includes(origin) || !origin) {
            return callback(null, true);
        }
        return callback(new Error("CORS origin not allowed ❌"));
    },
});