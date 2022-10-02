import { connection } from "../database/database.js";

async function readCustomers(req, res) {
    const { cpf } = res.locals;

    try {
        if(!cpf) {
            const customers = await connection.query(`SELECT * FROM customers;`);
            
            return res.send(customers.rows);
        }

        const customers = await connection.query(
            `SELECT * FROM customers WHERE cpf ILIKE $1 || '%';`, [cpf]
        );

        return res.send(customers.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function createCustomers(req, res) {
    const { name, phone, cpf, birthday } = res.locals.body;

    try {
        const existCustomers = await connection.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);

        if(existCustomers.rows[0]) {
            return res.sendStatus(409);
        }

        await connection.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]
        );

        res.sendStatus(201);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { readCustomers, createCustomers };