import { Router } from "express";
import { createCustomers, readCustomers } from "../controllers/customers.controllers.js";
import { validateCreateCustomers, validateReadCustomers } from "../middlewares/customers.middlewares.js";

const router = Router();

router.get("/customers", validateReadCustomers, readCustomers);
router.post("/customers", validateCreateCustomers, createCustomers);

export default router;