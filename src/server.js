import express from "express";
import cors from "cors";
import { connection } from "./database/database.js";

const app = express();
app.use(cors());
app.use(express.json());



app.get("/categories", async (req, res) => {
    try {
        const categories = await connection.query(
            `SELECT * FROM categories`
        );
        
        res.send(categories.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
});



app.listen(4000, () => console.log("Listening on port 4000"));