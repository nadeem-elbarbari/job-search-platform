// //             _.+._
//         (^\/^\/^\/^\/^\/^)
//          \@*@*@*@*@*@*@*@/
//         (`.   .'    .'   .')
//        (  :     :  .   :    )
//      __|   :   |__|     |___|
//     (____|   |____|_____|____)
//          |   |      |   |
//          |   |______|   |
//          |   |      |   |
//       (  |   |      |   |  )
//        `"""""      """""`"
//         Welcome to the Magical Realm of Express!
//            The Magic Awaits You ✨


import express from 'express';
import connectDB from './src/database/connect.js';
import bootstrap from './src/app.controller.js';
import './src/utils/cronJob.js';

// 🏰 The Kingdom of Express: Summoning the magic!
const app = express();

// 🔮 Casting the Bootstrap Spell to initialize the app
bootstrap(app, express);

app.get('/', (req, res) => {
    res.send('🌟 Welcome to the Magical Realm!');
});

// 🧙‍♂️ The Grand Wizard of the Server, preparing for the adventure ahead
app.listen(process.env.PORT, () => {
    console.log(`✨ The Portal to the Server Realm is open at: http://localhost:${process.env.PORT}`);

    // 🏰 Calling upon the ancient powers to connect to the database
    connectDB();
});
