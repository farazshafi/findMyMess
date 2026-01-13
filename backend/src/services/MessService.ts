import { IMessRepository } from '../repositories/IMessRepository';
import { IMess } from '../models/Mess';

export class MessService {
    private messRepository: IMessRepository;

    constructor(messRepository: IMessRepository) {
        this.messRepository = messRepository;
    }

    async getAllMesses(status: string = 'APPROVED'): Promise<IMess[]> {
        return this.messRepository.find({ status } as any);
    }

    async searchMessesByArea(area: string, status: string = 'APPROVED'): Promise<IMess[]> {
        return this.messRepository.findByArea(area, status);
    }

    async getPendingMesses(): Promise<IMess[]> {
        return this.messRepository.findByStatus('PENDING');
    }

    async updateMessStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<IMess | null> {
        return this.messRepository.update(id, { status } as any);
    }

    async getMessById(id: string): Promise<IMess | null> {
        return this.messRepository.findById(id);
    }

    async createMess(messData: Partial<IMess>): Promise<IMess> {
        return this.messRepository.create(messData);
    }

    async updateMess(id: string, messData: Partial<IMess>): Promise<IMess | null> {
        return this.messRepository.update(id, messData);
    }

    async deleteMess(id: string): Promise<boolean> {
        return this.messRepository.delete(id);
    }
}
