import { categorySchema } from "../schemas/categories.schemas.js";

function validateCategory(req, res, next) {
    const { name } = req.body;

    if(!name) {
        return res.sendStatus(400);
    }

    const validation = categorySchema.validate({ name }, { abortEarly: false });

    if(validation.error) {
        const errorList = validation.error.details.map(error => error.message);
        return res.status(422).send(errorList);
    }

    res.locals.name = name;
    next();
}

export { validateCategory };