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
exports.MessController = void 0;
const MessService_1 = require("../services/MessService");
const MessRepository_1 = require("../repositories/MessRepository");
const messRepository = new MessRepository_1.MessRepository();
const messService = new MessService_1.MessService(messRepository);
class MessController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { area } = req.query;
                let messes;
                if (area && typeof area === 'string') {
                    messes = yield messService.searchMessesByArea(area);
                }
                else {
                    messes = yield messService.getAllMesses();
                }
                res.json(messes);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch messes' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mess = yield messService.getMessById(req.params.id);
                if (!mess)
                    return res.status(404).json({ error: 'Mess not found' });
                res.json(mess);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to fetch mess' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mess = yield messService.createMess(req.body);
                res.status(201).json(mess);
            }
            catch (error) {
                res.status(400).json({ error: 'Failed to create mess', details: error });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mess = yield messService.updateMess(req.params.id, req.body);
                if (!mess)
                    return res.status(404).json({ error: 'Mess not found' });
                res.json(mess);
            }
            catch (error) {
                res.status(400).json({ error: 'Failed to update mess' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield messService.deleteMess(req.params.id);
                if (!success)
                    return res.status(404).json({ error: 'Mess not found' });
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete mess' });
            }
        });
    }
}
exports.MessController = MessController;
