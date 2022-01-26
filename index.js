const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const servicesCollection = database.collection('services');
        const projectsCollection = database.collection('projects');
        const messageCollection = database.collection('messages');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        app.get('/projects', async (req, res) => {
            const cursor = projectsCollection.find({});
            const projects = await cursor.toArray();
            res.json(projects);
        })
        app.get('/services/:_id', async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.json(result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.get('/orders/:email',async(req,res)=>{
            const email=req.params.email;
            const query={email:email};
            const cursor=await ordersCollection.find(query)
            const result=await cursor.toArray();
            res.json(result)
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
            const result = await servicesCollection.insertOne(service);

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
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }
            const result = await usersCollection.updateOne(filter, updateDoc);
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