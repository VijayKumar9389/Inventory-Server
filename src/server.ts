import express, {Express, Request, Response} from 'express';
import cors from 'cors';
import locationRoutes from "./routes/location.routes";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";
import path from "path";
import inventoryRoutes from "./routes/inventory.routes";
import itemRecordRoutes from "./routes/item-record.routes";

const app: Express = express();
const PORT: 4005 = 4005;

// enable cors
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
}));

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send('Inventory Server is running!');
});

app.get('/images/:name', (req: Request, res: Response): void => {
    const {name} = req.params;
    const imagePath: string = path.join(__dirname, `../uploads/${name}`);
    res.sendFile(imagePath);
});

app.use('/location', locationRoutes);
app.use('/item', itemRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/user', userRoutes);
app.use('/item-record', itemRecordRoutes);

app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
