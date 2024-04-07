const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const socketIo = require('socket.io');
const setupSocket = require('./socket');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection URI, to specific collection
const MONGODB_URI = 'mongodb+srv://navehroi:roi123456@roidb.upn2ppy.mongodb.net/code_block';

// Define a schema for the collection if wont find
const itemSchema = new mongoose.Schema({
    title: String,
    code: String,
    solution: String,
  });
  
// Create a model for code_block collection 
const Item = mongoose.model('Item', itemSchema, 'code_block');

app.use(express.static(path.join(__dirname, '../frontend/public')));

// Connect to MongoDB and connect the socket if succeed
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  
    // Start the server after successful connection
    const server = app.listen(PORT, () => {
         console.log(`Server is running on port ${PORT}`);
    });

    // Integrate Socket.IO with the Express server
    const io = socketIo(server);
    //socket handling the listening
    setupSocket(io);

}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });


// Connect the sever to lobby.html
app.get('/', async (req, res) => {
  try {
     // Send the HTML file
     res.sendFile(path.join(__dirname, '../frontend/public/lobby.html'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Listen to get request and send the details on the choosen code block
app.get('/codeBlock/:codeTitle', async (req, res) => {
    try {
        const params = req.params.codeTitle;

        //search the code block in the collection
        const item = await Item.findOne({ title: params });
        console.log("the return response:" + item);
        //send the respone
        res.json(item)
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

















// const express = require('express');
// const app = express();
// const { MongoClient } = require("mongodb");
// const MONGODB_URI = 'mongodb+srv://navehroi:roi123456@roidb.upn2ppy.mongodb.net/'; // MongoDB URI


// //const cors = require('cors');
// //app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// //app.use(cors());
// const port = 3080;

// MongoClient.connect(MONGODB_URI, (err, client) => {
//     console.log("get here")
//     if (err) {
//       console.log('Error connecting to MongoDB:', err);
//       return;
//     }
  
//     console.log('Connected to MongoDB');
//     const database = client.db('code_block');
//     const codeBlocks = database.collection('code_block');

//     app.listen(port, () => {
//         console.log(`Example app listening on port ${port}`);
//         //establish Mongo connection
    
        
//     });
// });














// // const client = new MongoClient(MONGODB_URI);
// //     try{
// //     const database = client.db('code_block');
// //     const codeBlocks = database.collection('code_block');
// //     }
// //     catch(e) {
// //         console.error(e.message);
// //     }
// //     run().catch(console.dir);
// // async function run() {
// //   try {
    
// //     // Query for a movie that has the title 'Back to the Future'
// //     const query = { title: 'Back to the Future' };
// //     const block = await codeBlocks.findOne(query);
// //     console.log(block);

// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     await client.close();
// //   }
// // }
