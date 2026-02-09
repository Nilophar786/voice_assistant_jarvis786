import React, { useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext.jsx';
import { motion } from 'framer-motion';

const FeedbackForm = ({ onClose }) => {
  const { submitFeedback } = useContext(userDataContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setLoading(true);
    try {
      const result = await submitFeedback({ rating, comment });
      if (result) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl focus:outline-none"
          >
            {star <= rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-6 text-center"
      >
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-gray-300">Your feedback has been submitted successfully.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900/95 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-6 max-w-md w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Share Your Feedback</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Rating</label>
          {renderStars()}
          <p className="text-sm text-gray-400">
            {rating === 0 ? 'Please select a rating' : `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none resize-none"
            rows={4}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={rating === 0 || !comment.trim() || loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default FeedbackForm;
