import express from 'express';
import connectDB from './src/database/connect.js';
import bootstrap from './src/app.controller.js';
import './src/utils/cronJob.js';

const app = express();

bootstrap(app, express);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port http://localhost:' + process.env.PORT);
    connectDB();
});
