import express from "express";
import cors from "cors";
import { connection } from "./database/database.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", async (req, res) => {
    try {
        const categories = await connection.query(
            `SELECT * FROM categories;`
        );
        
        res.send(categories.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.post("/categories", async (req, res) => {
    const { name } = req.body;

    if(!name) {
        return res.sendStatus(400);
    }

    try {
        const existName = await connection.query(
            `SELECT name FROM categories WHERE name = $1;`, [name]
        );

        if(existName.rows[0]) {
            return res.sendStatus(409);
        }

        await connection.query(
            `INSERT INTO categories (name) VALUES ($1);`, [name]
        );

        return res.sendStatus(201);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.listen(4000, () => console.log("Listening on port 4000"));