import { Router } from "express";
import { createRentals, readRentals } from "../controllers/rentals.controllers.js";
import { validateCreateRental } from "../middlewares/rentals.middlewares.js";

const router = Router();

router.get("/rentals", readRentals);
router.post("/rentals", validateCreateRental, createRentals);

export default router;