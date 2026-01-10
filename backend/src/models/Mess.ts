import mongoose, { Schema, Document } from 'mongoose';

export interface IMenu {
    item: string;
    description: string;
}

export interface IMealPlan {
    breakfast?: IMenu;
    lunch?: IMenu;
    dinner?: IMenu;
}

export interface IWeeklyMenu {
    monday?: IMealPlan;
    tuesday?: IMealPlan;
    wednesday?: IMealPlan;
    thursday?: IMealPlan;
    friday?: IMealPlan;
    saturday?: IMealPlan;
    sunday?: IMealPlan;
}

export interface IMess extends Document {
    name: string;
    area: string;
    priceRange: string;
    isMenuAvailable: boolean;
    menu?: IWeeklyMenu; // Made optional because isMenuAvailable could be false
    phone: string;
    whatsappLink?: string;
    photos?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const MealPlanSchema = new Schema({
    breakfast: {
        item: String,
        description: String
    },
    lunch: {
        item: String,
        description: String
    },
    dinner: {
        item: String,
        description: String
    }
}, { _id: false });

const WeeklyMenuSchema = new Schema({
    monday: MealPlanSchema,
    tuesday: MealPlanSchema,
    wednesday: MealPlanSchema,
    thursday: MealPlanSchema,
    friday: MealPlanSchema,
    saturday: MealPlanSchema,
    sunday: MealPlanSchema
}, { _id: false });

const MessSchema: Schema = new Schema({
    name: { type: String, required: true },
    area: { type: String, required: true, index: true },
    priceRange: { type: String, required: true },
    isMenuAvailable: { type: Boolean, default: false },
    menu: WeeklyMenuSchema,
    phone: { type: String, required: true },
    whatsappLink: { type: String },
    photos: [{ type: String }],
}, {
    timestamps: true
});

export default mongoose.model<IMess>('Mess', MessSchema);
