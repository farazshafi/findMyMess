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
exports.MessService = void 0;
class MessService {
    constructor(messRepository) {
        this.messRepository = messRepository;
    }
    getAllMesses() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.find({});
        });
    }
    searchMessesByArea(area) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.findByArea(area);
        });
    }
    getMessById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.findById(id);
        });
    }
    createMess(messData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.create(messData);
        });
    }
    updateMess(id, messData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.update(id, messData);
        });
    }
    deleteMess(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messRepository.delete(id);
        });
    }
}
exports.MessService = MessService;
