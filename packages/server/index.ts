import 'dotenv/config';
import express from 'express';
import router from './routes';

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

// app.post('/api/chat', (req, res) => {
//    console.log(req.body); // optional: to inspect what frontend sends
//    res.json({ message: 'Chat endpoint works!', data: req.body });
// });

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
