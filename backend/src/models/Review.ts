import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    messId: string;
    userIdentifier: string; // Phone or Email
    rating: number; // 1-5
    text: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    messId: { type: Schema.Types.ObjectId, ref: 'Mess', required: true },
    userIdentifier: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, maxlength: 500 },
}, {
    timestamps: true
});

// Prevent duplicate reviews from same user for same mess
ReviewSchema.index({ messId: 1, userIdentifier: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
