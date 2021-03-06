const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luqwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('crud-user-management');
        const usersCollection = database.collection('users');

        // Get All Data
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        // Find a User By MongoDB ID
        // app.get('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const result = await usersCollection.findOne(query)
        //     res.json(result)
        // })

        // Find a User By User ID
        app.get('/users/:user_id', async (req, res) => {
            const id = req.params.user_id;
            console.log(id);
            const query = { user_id: id }
            const result = await usersCollection.findOne(query)
            res.json(result)
        })

        // POST API || Create a User to Insert
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            res.json(result)
        })

        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API || PUT Method
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { user_id: id }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateInfo.name,
                    email: updateInfo.email,
                    mobile: updateInfo.mobile
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Server')
})

app.listen(port, () => {
    console.log('Server is Running on Port', port);
})