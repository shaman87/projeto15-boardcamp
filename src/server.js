import express from "express";
import categoriesRouter from "./routers/categories.routers.js";
import gamesRouter from "./routers/games.routers.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter);
app.use(gamesRouter);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));