"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const ReviewService_1 = require("../services/ReviewService");
const ReviewRepository_1 = require("../repositories/ReviewRepository");
const reviewRepository = new ReviewRepository_1.ReviewRepository();
const reviewService = new ReviewService_1.ReviewService(reviewRepository);
class ReviewController {
    static getByMessId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messId } = req.params;
                if (!messId)
                    return res.status(400).json({ error: 'Mess ID is required' });
                const reviews = yield reviewService.getReviewsByMessId(messId);
                res.json(reviews);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch reviews' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield reviewService.createReview(req.body);
                res.status(201).json(review);
            }
            catch (error) {
                res.status(400).json({ error: 'Failed to create review', details: error });
            }
        });
    }
}
exports.ReviewController = ReviewController;
