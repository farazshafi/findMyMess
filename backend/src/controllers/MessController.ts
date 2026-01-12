import { Request, Response } from 'express';
import { MessService } from '../services/MessService';
import { MessRepository } from '../repositories/MessRepository';
import fs from 'fs';
import path from 'path';

const messRepository = new MessRepository();
const messService = new MessService(messRepository);

export class MessController {

    static async getAll(req: Request, res: Response) {
        try {
            const { area } = req.query;
            let messes;
            if (area && typeof area === 'string') {
                messes = await messService.searchMessesByArea(area);
            } else {
                messes = await messService.getAllMesses();
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

            if (req.file) {
                messData.logo = {
                    url: (req.file as any).path,
                    public_id: (req.file as any).filename
                };
            }

            const mess = await messService.createMess(messData);
            res.status(201).json(mess);
        } catch (error) {
            console.error('Error creating mess:', error);
            res.status(400).json({
                error: 'Failed to create mess',
                details: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const messData = req.body;

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
}
