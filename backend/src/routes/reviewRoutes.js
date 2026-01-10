"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = require("../controllers/ReviewController");
const router = (0, express_1.Router)();
router.get('/mess/:messId', ReviewController_1.ReviewController.getByMessId);
router.post('/', ReviewController_1.ReviewController.create);
exports.default = router;
