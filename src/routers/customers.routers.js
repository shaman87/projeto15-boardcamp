import { Router } from "express";
import { createCustomers, readCustomers, readCustomersId, updateCustomers } from "../controllers/customers.controllers.js";
import { validateCreateCustomers, validateReadCustomers } from "../middlewares/customers.middlewares.js";

const router = Router();

router.get("/customers/:id", readCustomersId);
router.get("/customers", validateReadCustomers, readCustomers);
router.post("/customers", validateCreateCustomers, createCustomers);
router.put("/customers/:id", validateCreateCustomers, updateCustomers);

export default router;