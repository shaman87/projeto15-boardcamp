import { Router } from "express";
import { createRentals, deleteRentals, readRentals, updateRentals } from "../controllers/rentals.controllers.js";
import { validateCreateRental } from "../middlewares/rentals.middlewares.js";

const router = Router();

router.get("/rentals", readRentals);
router.post("/rentals", validateCreateRental, createRentals);
router.post("/rentals/:id/return", updateRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;