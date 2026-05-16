import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes.js';
import type { Request, Response, NextFunction } from 'express';

const app = express();
app.use(
   cors({
      origin: process.env.CLIENT_URL,
   })
);
// Parse JSON
app.use(express.json());
// Routes
app.use(router);

app.use((_req: Request, res: Response) => {
   res.status(404).json({ error: 'Route not found' });
});
//Global error handler (prevents silent crashes)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
   console.error(err);
   res.status(500).json({ error: 'Internal server error' });
});

// Port config (Required by Render)
const port = process.env.PORT || 3000;

// app.post('/api/chat', (req, res) => {
//    console.log(req.body); // optional: to inspect what frontend sends
//    res.json({ message: 'Chat endpoint works!', data: req.body });
// });

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
