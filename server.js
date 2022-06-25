const express = require('express');
const app = express();
const cors = require('cors');
const {MongoClient, ObjectID} = require('mongodb');
const { response } = require('express');
require('dotenv').config();
const PORT = 3000;

let db;
    dbConnectionStr = process.env.DB_CONNECTION_STR;
    dbName = 'sample_mflix',
    collection = 'movies';

MongoClient.connect(dbConnectionStr)
    .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    collection = db.collection('movies');
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/search', async (req, res) => {
    try{
        let  results = await collection.aggregate([
            {$Search: {
                "autocomplete": {
                    "query": `${req.query.q}`,
                    "path": "title",
                    "fuzzy": {
                        "maxEdits": 2,
                        "prefixLength": 3
                    }
                }
            }
        }
    ]).toArray();
        res.send(result);
    }catch{
        response.status(500).send({message: 'Error searching for movies'});
    }
})

app.get("/get/:id", async (req, res) => {
    try{
        let result = await collection.findOne({_id: ObjectId(req.params.id)});
        res.send(result);
    } catch {
        response.status(500).send({message: 'Error getting movie'});
    }
}
)


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running`);
})
