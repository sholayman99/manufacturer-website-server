const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()



//middle ware

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@de-walt0.y1cee.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    
    try{
        await client.connect();
        const toolCollection = client.db('de_walt').collection('tools')


        app.get('/tool' , async(req,res)=>{
            const query = {}
            const cursor= toolCollection.find(query)
            const tools = await cursor.toArray()
            res.send(tools)
        })
    }
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})