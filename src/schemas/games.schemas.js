import joi from "joi";

const gameReadSchema = joi.object({
    name: joi.string().empty(" ").required()
});

const gameCreateSchema = joi.object({
    name: joi.string().empty(" ").required(), 
    image: joi.string().uri().empty(" ").required(), 
    stockTotal: joi.number().integer().min(1).required(), 
    categoryId: joi.number().integer().required(), 
    pricePerDay: joi.number().integer().min(1).required()
});

export { gameCreateSchema, gameReadSchema };