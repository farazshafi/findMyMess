import { IReviewRepository } from '../repositories/IReviewRepository';
import { IReview } from '../models/Review';

export class ReviewService {
    private reviewRepository: IReviewRepository;

    constructor(reviewRepository: IReviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    async getReviewsByMessId(messId: string): Promise<IReview[]> {
        return this.reviewRepository.findByMessId(messId);
    }

    async createReview(reviewData: Partial<IReview>): Promise<IReview> {
        return this.reviewRepository.create(reviewData);
    }
}
