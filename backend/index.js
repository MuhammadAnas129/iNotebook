const connectToMongo = require('./db');
const express = require('express');
// require('dotenv').config();
connectToMongo();

const app = express();
const port = 5000
//Midelware
app.use(express.json());

//Available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

// app.get('/', (req, res) => {
//     res.send('hello world')
//   })
app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})
