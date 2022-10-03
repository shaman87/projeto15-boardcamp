import { connection } from "../database/database.js";

async function readRentals(req, res) {
    const { customerId, gameId } = req.query;
    let rentalsList;

    try {
        const defaultQuery = `
            SELECT rentals.*, 
            json_build_object(
                'id', customers.id, 
                'name', customers.name
            ) AS customer, 
            json_build_object(
                'id', games.id, 
                'name', games.name, 
                'categoryId', games."categoryId", 
                'categoryName', categories.name
            ) AS game 
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id 
            JOIN games ON rentals."gameId" = games.id 
            JOIN categories ON games."categoryId" = categories.id
        `;

        if(customerId && gameId) {
            rentalsList = await connection.query(
                `${defaultQuery} WHERE "customerId" = $1 AND "gameId" = $2;`, [customerId, gameId]
            );
        } else if(customerId && !gameId) {
            rentalsList = await connection.query(
                `${defaultQuery} WHERE "customerId" = $1`, [customerId]
            );
        } else if(!customerId && gameId) {
            rentalsList = await connection.query(
                `${defaultQuery} WHERE "gameId" = $1;`, [gameId]
            );
        } else {
            rentalsList = await connection.query(defaultQuery);
        }

        rentalsList.rows.forEach(rent => {
            rent.rentDate = rent.rentDate.toISOString().substring(0, 10);
        });

        res.send(rentalsList.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = res.locals.body;
    const date = new Date();

    try {
        const existCustomer = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);

        if(!existCustomer.rows[0]) {
            return res.sendStatus(400);
        }

        const existGame = await connection.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);

        if(!existGame.rows[0]) {
            return res.sendStatus(400);
        }

        const numberOfRentals = await connection.query(
            `SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null;`, [gameId]
        );

        if((numberOfRentals.rowCount > 0) && (existGame.rows[0].stockTotal === numberOfRentals.rowCount)) {
            return res.sendStatus(400);
        }

        const originalPrice = daysRented * existGame.rows[0].pricePerDay;

        await connection.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, date, daysRented, null, originalPrice, null]
        );

        res.sendStatus(201);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function updateRentals(req, res) {
    const { id } = req.params;
    const today = new Date();

    try {
        const existRental = await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if(!existRental.rows[0]) {
            return res.sendStatus(404);
        }

        if(existRental.rows[0].returnDate) {
            return res.sendStatus(404);
        }
        
        const pastDays = Math.floor((today.getTime() - (existRental.rows[0].rentDate.getTime())) / (1000 * 60 * 60 * 24));
        
        let delayFee = 0;

        if(pastDays > existRental.rows[0].daysRented) {
            delayFee = (existRental.rows[0].originalPrice / existRental.rows[0].daysRented) * (pastDays - existRental.rows[0].daysRented);
        }

        await connection.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [today, delayFee, existRental.rows[0].id]
        );

        res.sendStatus(200);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function deleteRentals(req, res) {
    const { id } = req.params;

    try {
        const existRental = await connection.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);

        if(!existRental.rows[0]) {
            return res.sendStatus(404);
        }

        if(!existRental.rows[0].returnDate) {
            return res.sendStatus(400);
        }

        await connection.query("DELETE FROM rentals WHERE id = $1;", [id]);

        res.sendStatus(200);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { createRentals, readRentals, updateRentals, deleteRentals };