const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000

//midleware
app.use(cors());
app.use(express.json());
app.use(fileUpload())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwf59.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('luxury_living');
        const serviceCollection = database.collection('services');
        const projectsCollection = database.collection('projects');
        const messageCollection = database.collection('messages');

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        app.post('/services', async (req, res) => {
            const serviceTitle = req.body.serviceTitle;
            const description = req.body.description;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const service = {
                serviceTitle,
                description,
                image: imageBuffer
            }
            const result = await serviceCollection.insertOne(service);

            res.json(result);
        })
        app.post('/projects', async (req, res) => {
            const projectTitle = req.body.projectTitle;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');

            const project = {
                projectTitle,
                image: imageBuffer
            }
            const result = await projectsCollection.insertOne(project);
            res.json(result);
        })

        app.post('/messages', async (req, res) => {
            const message = req.body;
            console.log('api is hitted', message);

            const result = await messageCollection.insertOne(message);

            res.json(result);
        })

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