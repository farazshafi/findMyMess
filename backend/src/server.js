"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/findMyMess';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
const messRoutes_1 = __importDefault(require("./routes/messRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
// Basic Route
app.get('/', (req, res) => {
    res.send('findMyMess API is running');
});
// API Routes
app.use('/api/messes', messRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
