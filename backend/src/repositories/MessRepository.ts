import { BaseRepository } from './BaseRepository';
import Mess, { IMess } from '../models/Mess';
import { IMessRepository } from './IMessRepository';

export class MessRepository extends BaseRepository<IMess> implements IMessRepository {
    constructor() {
        super(Mess);
    }

    async findByArea(area: string): Promise<IMess[]> {
        return this.find({ area: { $regex: new RegExp(area, 'i') } } as any);
    }
}
