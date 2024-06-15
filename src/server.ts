import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import locationRoutes from './api/routes/location.routes';
import itemRoutes from './api/routes/item.routes';
import userRoutes from './api/routes/user.routes';
import inventoryRoutes from './api/routes/inventory.routes';
import itemRecordRoutes from './api/routes/item-record.routes';
import validateToken from './api/middleware/auth';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {bucketName, s3} from "./api/middleware/s3";

const app: Express = express();
const PORT = process.env.PORT || 4005;

// Enable CORS
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'refreshToken', 'accessToken'],
    })
);

// Middleware
app.use(express.json());
app.get('/', (req: Request, res: Response): void => {
    res.send('Inventory Server is running!');
});

// Fetch the signed URL for an image
app.get('/api/images/:name', async (req: Request, res: Response,): Promise<void> => {
    const { name } = req.params;

    // Determine the environment
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

    // Create a key with the environment folder
    const key: string = `${environment}/${name}`;


    const params = {
        Bucket: bucketName!,
        Key: key,
    };

    try {
        const command: GetObjectCommand = new GetObjectCommand(params);
        const signedUrl: string = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
        res.json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
});

// Routes
app.use('/location', validateToken(false), locationRoutes);
app.use('/item', validateToken(false), itemRoutes);
app.use('/inventory', validateToken(false), inventoryRoutes);
app.use('/user', userRoutes);
app.use('/item-record', validateToken(false), itemRecordRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
