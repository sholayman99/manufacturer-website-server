const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = client.db('de_walt').collection('reviews')
        const orderCollection= client.db('de_walt').collection('orders')
//getting all tools
        app.get('/tool' , async(req,res)=>{
            const query = {}
            const cursor= toolCollection.find(query)
            const tools = await cursor.toArray()
            res.send(tools)
        })

//getting one tool

      app.get('/tool/:_id', async(req,res)=>{
        const id = req.params._id
        const query = {_id:ObjectId(id)}
        const result = await toolCollection.findOne(query)
        res.send(result)
      })
 
        
 //getting all reviews       
        app.get('/review' , async(req,res)=>{
            const query = {}
            const cursor= reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
   //getting order
   
   app.post('/order', async(req,res)=>{
     const order = req.body
     const query = {userEmail:order.userEmail,userName:order.userName,phone:order.phone,address:order.address}
     const exist = await orderCollection.findOne(query)
     if(exist){
      return res.send({ success: false, order: exist })
     }
     const result = await orderCollection.insertOne(order)
    return res.send({success:true,result})
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