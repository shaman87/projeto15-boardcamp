import { connection } from "../database/database.js";

async function readCategories(req, res) {
    try {
        const categories = await connection.query(`SELECT * FROM categories;`);
        
        res.send(categories.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

async function createCategory(req, res) {
    const { name } = res.locals;

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
};

export { readCategories, createCategory };