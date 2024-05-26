import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import locationRoutes from './routes/location.routes';
import itemRoutes from './routes/item.routes';
import userRoutes from './routes/user.routes';
import inventoryRoutes from './routes/inventory.routes';
import itemRecordRoutes from './routes/item-record.routes';
import validateToken from './middleware/auth';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {bucketName, s3} from "./middleware/s3";

const app: Express = express();
const PORT = process.env.PORT || 4005;

// Enable CORS
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'refreshToken', 'accessToken'],
        exposedHeaders: ['Authorization'],
    })
);

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('Inventory Server is running!');
});

app.get('/api/images/:name', async (req: Request, res: Response,): Promise<void> => {
    const { name } = req.params;

    console.log(name)

    const params = {
        Bucket: bucketName!,
        Key: name,
    };

    try {
        const command = new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL expires in 1 hour
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
