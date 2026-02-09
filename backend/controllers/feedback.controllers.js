import Feedback from "../models/feedback.model.js";

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.userId;

    // Validate input
    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Create feedback
    const feedback = await Feedback.create({
      userId,
      rating,
      comment: comment.trim()
    });

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback
    });

  } catch (error) {
    console.error("Submit feedback error:", error);
    return res.status(500).json({ message: "Failed to submit feedback", error: error.message });
  }
};

// Get user's feedback
export const getUserFeedback = async (req, res) => {
  try {
    const userId = req.userId;

    const feedback = await Feedback.find({ userId })
      .sort({ date: -1 })
      .populate('userId', 'name email');

    return res.status(200).json(feedback);

  } catch (error) {
    console.error("Get user feedback error:", error);
    return res.status(500).json({ message: "Failed to get feedback", error: error.message });
  }
};

// Get average rating
export const getAverageRating = async (req, res) => {
  try {
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;
    const totalFeedback = result.length > 0 ? result[0].totalFeedback : 0;

    return res.status(200).json({
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalFeedback
    });

  } catch (error) {
    console.error("Get average rating error:", error);
    return res.status(500).json({ message: "Failed to get average rating", error: error.message });
  }
};

// Get all feedback (admin)
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .sort({ date: -1 })
      .populate('userId', 'name email');

    return res.status(200).json(feedback);

  } catch (error) {
    console.error("Get all feedback error:", error);
    return res.status(500).json({ message: "Failed to get feedback", error: error.message });
  }
};
