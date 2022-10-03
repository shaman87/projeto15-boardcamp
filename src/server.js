import express from "express";
import categoriesRouter from "./routes/categories.routers.js";
import gamesRouter from "./routes/games.routers.js";
import customersRouter from "./routes/customers.routers.js";
import rentalsRouter from "./routes/rentals.routers.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));