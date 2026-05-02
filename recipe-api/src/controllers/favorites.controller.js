import Favorite from "../models/Favorite.js";

// 📋 Get all user favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➕ Add to favorites
export const addFavorite = async (req, res) => {
  try {
    const { recipeId, title, image, readyInMinutes } = req.body;

    if (!recipeId || !title || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide recipeId, title, and image",
      });
    }

    const exists = await Favorite.findOne({
      userId: req.user._id,
      recipeId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Recipe already in favorites",
      });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      recipeId,
      title,
      image,
      readyInMinutes,
    });

    res.status(201).json({
      success: true,
      message: "Added to favorites",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user._id,
      recipeId: parseInt(recipeId),
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🗑️ Clear all favorites
export const clearFavorites = async (req, res) => {
  try {
    await Favorite.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: "All favorites cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};