import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router
  .route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.delete("/:id", removeFromCart);

export default router;