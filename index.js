import { deployServer } from "./servers/server-with-mysql.js";
const PORT = process.env.PORT ?? 3000;

const app = deployServer();
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});