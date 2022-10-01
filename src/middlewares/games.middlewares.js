import { gameCreateSchema, gameReadSchema } from "../schemas/games.schemas.js";

function validateReadGame(req, res, next) {
    const { name } = req.query;

    if(!name) {
        return next();
    }

    const validation = gameReadSchema.validate({ name }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(400).send(errorList);
    }

    res.locals.name = name;
    next();
}

function validateCreateGame(req, res, next) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    const validation = gameCreateSchema.validate({ name, image, stockTotal, categoryId, pricePerDay }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(400).send(errorList);
    }

    res.locals.body = { name, image, stockTotal, categoryId, pricePerDay };
    next();
}

export { validateCreateGame, validateReadGame };