import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { ReviewRepository } from '../repositories/ReviewRepository';

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);

export class ReviewController {

    static async getByMessId(req: Request, res: Response) {
        try {
            const { messId } = req.params;
            if (!messId) return res.status(400).json({ error: 'Mess ID is required' });

            const reviews = await reviewService.getReviewsByMessId(messId);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const review = await reviewService.createReview(req.body);
            res.status(201).json(review);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create review', details: error });
        }
    }
}
