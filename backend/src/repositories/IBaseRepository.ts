export interface IBaseRepository<T> {
    create(item: Partial<T>): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    find(item: Partial<T>): Promise<T[]>;
    findById(id: string): Promise<T | null>;
}
