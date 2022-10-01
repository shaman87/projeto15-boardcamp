import { Router } from "express";
import { createCategory, readCategories } from "../controllers/categories.controllers.js";
import { validateCategory } from "../middlewares/categories.middlewares.js";

const router = Router();

router.get("/categories", readCategories);
router.post("/categories", validateCategory, createCategory);

export default router;