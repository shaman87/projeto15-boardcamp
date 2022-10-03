import { createRentalSchema } from "../schemas/rentals.schemas.js";

function validateCreateRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    const validation = createRentalSchema.validate({ customerId, gameId, daysRented }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(400).send(errorList);
    }

    res.locals.body = { customerId, gameId, daysRented };
    next();
}

export { validateCreateRental };