require('dotenv').config()
const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // await client.connect();

        const hobbyCollection = client.db('hobbyDB').collection('hobby')
        const usersCollection = client.db('hobbyDB').collection('users')



        app.get('/hobby', async (req, res) => {
            try {
                const sortOrder = req.query.sort === 'desc' ? -1 : 1;
                const search = (req.query.search || '') || '';

                const filter = {};
                if (search) {
                    filter.groupName = { $regex: search, $options: 'i' };
                }

                const hobbies = await hobbyCollection
                    .find(filter)
                    .sort({ groupName: sortOrder })
                    .toArray();

                console.log('Search:', search, 'Sort order:', sortOrder, 'Results count:', hobbies.length);
                res.send(hobbies);
            } catch (error) {
                console.error('Error fetching hobbies:', error);
                res.status(500).send({ error: 'Failed to fetch hobbies' });
            }
        });


        app.post('/hobby', async (req, res) => {
            const newHobby = req.body;

            // Trim groupName to remove leading/trailing spaces
            if (newHobby.groupName) {
                newHobby.groupName = newHobby.groupName.trim();
            }

            console.log(newHobby);
            const result = await hobbyCollection.insertOne(newHobby);
            res.send(result);
        });


        //user related APIs

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userProfile = req.body
            console.log(userProfile)
            const result = await usersCollection.insertOne(userProfile)
            res.send(result)
        })

        //hobby

        app.get('/hobby/:id', async (req, res) => {
            const id = req.params.id;
            const group = await hobbyCollection.findOne({ _id: new ObjectId(id) });

            res.send(group);
        });

        app.delete('/hobby/:id', async (req, res) => {
            const id = req.params.id;
            const result = await hobbyCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });


        app.put('/hobby/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;

            // Trim groupName to remove leading/trailing spaces before updating
            if (updatedData.groupName) {
                updatedData.groupName = updatedData.groupName.trim();
            }

            const updateDoc = {
                $set: updatedData
            };

            const result = await hobbyCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
            res.send(result);
        });


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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

