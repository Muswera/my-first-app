import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

// app.post('/api/chat', (req, res) => {
//    console.log(req.body); // optional: to inspect what frontend sends
//    res.json({ message: 'Chat endpoint works!', data: req.body });
// });

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
