import type { Request, Response } from "express";
import { reviewService } from "../services/review.servies";
import { productRepository } from "../repositories/product.resository";
import { reviewsRepository } from "../repositories/review.repository";

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    try {
      const reviews = await reviewsRepository.getReviews(productId);
      const summary = await reviewsRepository.getReviewSummary(productId);
      return res.json({
        summary,
        reviews,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  async reviewSummarize(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await productRepository.getProduct(productId);

    if (!product) {
      return res.status(400).json({ error: "Invalid product" });
    }

    const review = await reviewsRepository.getReviews(productId, 1);

    if (!review.length) {
      return res
        .status(400)
        .json({ error: "Threre are no reviews for the product to summarize" });
    }

    const response = await reviewService.reviewSummarize(productId);
    return res.json({ summary: response });
  },
};
