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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const location_routes_1 = __importDefault(require("./api/routes/location.routes"));
const item_routes_1 = __importDefault(require("./api/routes/item.routes"));
const user_routes_1 = __importDefault(require("./api/routes/user.routes"));
const inventory_routes_1 = __importDefault(require("./api/routes/inventory.routes"));
const item_record_routes_1 = __importDefault(require("./api/routes/item-record.routes"));
const auth_1 = __importDefault(require("./api/middleware/auth"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3_1 = require("./api/middleware/s3");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4005;
// Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'refreshToken', 'accessToken'],
}));
// Middleware
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Inventory Server is running!');
});
// Fetch the signed URL for an image
app.get('/api/images/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    // Determine the environment
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    // Create a key with the environment folder
    const key = `${environment}/${name}`;
    const params = {
        Bucket: s3_1.bucketName,
        Key: key,
    };
    try {
        const command = new client_s3_1.GetObjectCommand(params);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3_1.s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
        res.json({ url: signedUrl });
    }
    catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
}));
// Routes
app.use('/location', (0, auth_1.default)(false), location_routes_1.default);
app.use('/item', (0, auth_1.default)(false), item_routes_1.default);
app.use('/inventory', (0, auth_1.default)(false), inventory_routes_1.default);
app.use('/user', user_routes_1.default);
app.use('/item-record', (0, auth_1.default)(false), item_record_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
