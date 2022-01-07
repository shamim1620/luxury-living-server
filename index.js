const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwf59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connect sussesfully');

    }
    finally {
        // await client(close);
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("lusury living is runnig");
})

app.listen(port, () => {
    console.log('server is running at port', port);
})