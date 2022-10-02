import joi from "joi";

const customersReadSchema = joi.object({
    cpf: joi.string().empty(" ").required()
});

const customersCreateSchema = joi.object({
    name: joi.string().empty(" ").required(), 
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(), 
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(), 
    birthday: joi.date().less("now").required()
});

export { customersReadSchema, customersCreateSchema };