import { customersCreateSchema, customersReadSchema } from "../schemas/customers.schemas.js";

function validateReadCustomers(req, res, next) {
    const { cpf } = req.query;

    if(!cpf) {
        return next();
    }

    const validation = customersReadSchema.validate({ cpf }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(400).send(errorList);
    }

    res.locals.cpf = cpf;
    next();
}

function validateCreateCustomers(req, res, next) {
    const { name, phone, cpf, birthday } = req.body;

    const validation = customersCreateSchema.validate({ name, phone, cpf, birthday }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(400).send(errorList);
    }

    res.locals.body = { name, phone, cpf, birthday };
    next();
}

export { validateReadCustomers, validateCreateCustomers };