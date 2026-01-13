import { Request, Response } from 'express';
import { MessService } from '../services/MessService';
import { MessRepository } from '../repositories/MessRepository';

const messRepository = new MessRepository();
const messService = new MessService(messRepository);

export class MessController {

    static async getAll(req: Request, res: Response) {
        try {
            const { area } = req.query;
            const status = (req.query.status as string) || 'APPROVED';
            let messes;
            if (area && typeof area === 'string') {
                messes = await messService.searchMessesByArea(area, status);
            } else {
                messes = await messService.getAllMesses(status);
            }
            res.json(messes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch messes' });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const mess = await messService.getMessById(req.params.id);
            if (!mess) return res.status(404).json({ error: 'Mess not found' });
            res.json(mess);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch mess' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const messData = req.body;

            // If menu is sent as a string (common in multipart/form-data), parse it
            if (typeof messData.menu === 'string') {
                try {
                    messData.menu = JSON.parse(messData.menu);
                } catch (e) {
                    console.error('Error parsing menu JSON:', e);
                }
            }

            // Robust parsing for FormData fields
            if (messData.isMenuAvailable === 'true') {
                messData.isMenuAvailable = true;
            } else if (messData.isMenuAvailable === 'false') {
                messData.isMenuAvailable = false;
            }

            if (req.file) {
                messData.logo = {
                    url: (req.file as any).path,
                    public_id: (req.file as any).filename
                };
            }

            const adminKey = req.headers['x-admin-key'];
            const isAdmin = adminKey && adminKey === process.env.ADMIN_KEY;

            messData.status = isAdmin ? 'APPROVED' : 'PENDING';

            const mess = await messService.createMess(messData);
            res.status(201).json(mess);
        } catch (error: any) {
            console.error('Error creating mess:', error);
            res.status(400).json({
                error: 'Failed to create mess',
                details: error.message
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const messData = req.body;

            // Robust parsing for FormData fields
            if (messData.isMenuAvailable === 'true') {
                messData.isMenuAvailable = true;
            } else if (messData.isMenuAvailable === 'false') {
                messData.isMenuAvailable = false;
            }

            // If menu is sent as a string, parse it
            if (typeof messData.menu === 'string') {
                try {
                    messData.menu = JSON.parse(messData.menu);
                } catch (e) {
                    // Ignore or handle parse error
                }
            }

            if (req.file) {
                messData.logo = {
                    url: (req.file as any).path,
                    public_id: (req.file as any).filename
                };
            }

            const mess = await messService.updateMess(req.params.id, messData);
            if (!mess) return res.status(404).json({ error: 'Mess not found' });
            res.json(mess);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update mess' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await messService.deleteMess(req.params.id);
            if (!success) return res.status(404).json({ error: 'Mess not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete mess' });
        }
    }

    static async getPending(req: Request, res: Response) {
        try {
            const messes = await messService.getPendingMesses();
            res.json(messes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch pending messes' });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { status } = req.body;
            if (!['APPROVED', 'REJECTED'].includes(status)) {
                return res.status(400).json({ error: 'Invalid status' });
            }
            const mess = await messService.updateMessStatus(req.params.id, status);
            if (!mess) return res.status(404).json({ error: 'Mess not found' });
            res.json(mess);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update status' });
        }
    }
}
