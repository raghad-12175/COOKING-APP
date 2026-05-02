import CartItem from "../models/CartItem.js";

// 🛒 Get all cart items for user
export const getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➕ Add ingredients to cart
export const addToCart = async (req, res) => {
  try {
    const { ingredients, recipeTitle } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of ingredients",
      });
    }

    const itemsToAdd = ingredients.map((ing) => ({
      userId: req.user._id,
      ingredientId: ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      recipeTitle: recipeTitle || "Unknown Recipe",
    }));

    const items = await CartItem.insertMany(itemsToAdd);

    res.status(201).json({
      success: true,
      message: `${items.length} items added to cart`,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Remove single item from cart
export const removeFromCart = async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🗑️ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};