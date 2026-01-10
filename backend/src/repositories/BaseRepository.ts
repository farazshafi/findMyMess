import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
    private model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        return this.model.create(item);
    }

    async update(id: string, item: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, item as UpdateQuery<T>, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }

    async find(item: Partial<T>): Promise<T[]> {
        return this.model.find(item as FilterQuery<T>).exec();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }
}
