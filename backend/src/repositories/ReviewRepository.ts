import { BaseRepository } from './BaseRepository';
import Review, { IReview } from '../models/Review';
import { IReviewRepository } from './IReviewRepository';

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(Review);
    }

    async findByMessId(messId: string): Promise<IReview[]> {
        return this.find({ messId } as any);
    }
}
