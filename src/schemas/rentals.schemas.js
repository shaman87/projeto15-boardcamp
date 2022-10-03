import joi from "joi";

const createRentalSchema = joi.object({
    customerId: joi.number().integer().required(), 
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().min(1).required()
});

export { createRentalSchema };