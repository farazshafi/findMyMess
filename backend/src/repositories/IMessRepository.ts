import { IBaseRepository } from './IBaseRepository';
import { IMess } from '../models/Mess';

export interface IMessRepository extends IBaseRepository<IMess> {
    findByArea(area: string): Promise<IMess[]>;
}
