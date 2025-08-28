import express from "express";
import * as cardsController from "../controllers/cardController.js"

export const router = express.Router();

router.get("/cards", cardsController.getAll);
router.patch("/cards/:id", cardsController.updateOne);
router.put("/cards/reorder", cardsController.reorder)