import { connection } from "../database/database.js";

async function readCustomers(req, res) {
    const { cpf } = res.locals;
    let customers;

    try {
        if(!cpf) {
            customers = await connection.query(`SELECT * FROM customers;`);
            
            customers.rows.forEach(customer => {
                customer.birthday = customer.birthday.toISOString().substring(0, 10);
            });

            return res.send(customers.rows);
        }

        customers = await connection.query(
            `SELECT * FROM customers WHERE cpf ILIKE $1 || '%';`, [cpf]
        );

        customers.rows.forEach(customer => {
            customer.birthday = customer.birthday.toISOString().substring(0, 10);
        });
        
        return res.send(customers.rows);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function readCustomersId(req, res) {
    const { id } = req.params;

    try {
        const customer = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [id]);

        if(!customer.rows[0]) {
            return res.sendStatus(404);
        }

        return res.send(customer.rows[0]);

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

async function updateCustomers(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = res.locals.body;

    try {
        await connection.query(
            `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);

    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export { readCustomers, readCustomersId, createCustomers, updateCustomers };