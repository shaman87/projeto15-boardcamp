import { Router } from "express";
import { createGame, readGames } from "../controllers/games.controllers.js";
import { validateCreateGame, validateReadGame } from "../middlewares/games.middlewares.js";

const router = Router();

router.get("/games", validateReadGame, readGames);
router.post("/games", validateCreateGame, createGame);

export default router;