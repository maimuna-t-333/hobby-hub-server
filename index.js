const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@xenpi.9qo9gbb.mongodb.net/?retryWrites=true&w=majority&appName=XenPi`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const hobbyCollection=client.db('hobbyDB').collection('hobby')
        const usersCollection=client.db('hobbyDB').collection('users')

        app.get('/hobby',async(req,res)=>{
            const result=await hobbyCollection.find().toArray()
            res.send(result)
        })

        app.post('/hobby',async(req,res)=>{
            const newHobby=req.body
            console.log(newHobby)
            const result=await hobbyCollection.insertOne(newHobby)
            res.send(result)
        })

        //user related APIs
        app.post('/users',async(req,res)=>{
            const userProfile=req.body
            console.log(userProfile)
            const result=await usersCollection.insertOne(userProfile)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hobby hub server is running')
})

app.listen(port, () => {
    console.log(`Hobby hub is runnig on port ${port}`)
})

