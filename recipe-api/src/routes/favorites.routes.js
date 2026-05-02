import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "../controllers/favorites.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected (need login)
router.use(protect);

router
  .route("/")
  .get(getFavorites)
  .post(addFavorite)
  .delete(clearFavorites);

router.delete("/:recipeId", removeFavorite);

export default router;