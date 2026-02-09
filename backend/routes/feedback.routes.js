import express from "express";
import { submitFeedback, getUserFeedback, getAverageRating, getAllFeedback } from "../controllers/feedback.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const feedbackRouter = express.Router();

// Submit feedback
feedbackRouter.post("/submit", isAuth, submitFeedback);

// Get user's feedback
feedbackRouter.get("/user", isAuth, getUserFeedback);

// Get average rating
feedbackRouter.get("/average", getAverageRating);

// Get all feedback (admin)
feedbackRouter.get("/all", isAuth, getAllFeedback);

export default feedbackRouter;
