import { IBaseRepository } from './IBaseRepository';
import { IReview } from '../models/Review';

export interface IReviewRepository extends IBaseRepository<IReview> {
    findByMessId(messId: string): Promise<IReview[]>;
}
