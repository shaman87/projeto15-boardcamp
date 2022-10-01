import { connection } from "../database/database.js";

async function readGames(req, res) {
    const { name } = res.locals;

    try {
        if(!name) {
            const games = await connection.query(
                `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`
            );
    
            return res.send(games.rows);
        }
        
        const games = await connection.query(
            `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name ILIKE $1 || '%';`,  
            [name]
        );

        return res.send(games.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

async function createGame(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.body;

    try {
        const existCategory = await connection.query(
            `SELECT * FROM categories WHERE id = $1;`, [categoryId]
        );

        if(!existCategory.rows[0]) {
            return res.sendStatus(400);
        }

        const existName = await connection.query(
            `SELECT * FROM games WHERE name = $1;`, [name]
        );

        if(existName.rows[0]) {
            return res.sendStatus(409);
        }

        await connection.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, 
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        return res.sendStatus(201);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { readGames, createGame };