const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        const profileCollection= client.db('de_walt').collection('profile')
        const userCollection = client.db('de_walt').collection('users');
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

 //posting tool
 app.post('/tool', async(req,res)=>{
   const tool = req.body
   const result = await toolCollection.insertOne(tool)
   res.send({success:true,result})
 })     
 //updating available quantity

//  app.put('/tool/:_id' , async(req,res)=>{
//    const id = req.params._id
//    const newQuantity = req.body
//    const filter = { _id: ObjectId(id) }
//    const options = { upsert: true }
//    const doc = {
//     $set: {
//        availableQuantity: newQuantity.availableQuantity
//     }
//   }
//   const result = await toolCollection.updateOne(filter, doc, options)
//   res.send(result)

//  })

 //updating user
 app.put('/user/:email', async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
  res.send({result,token});
});

//loading user

app.get('/user', async (req, res) => {
  const users = await userCollection.find().toArray();
  res.send(users);
});

//making admin

app.put('/user/admin/:email', async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const updateDoc = {
    $set: { role: 'admin' },
  };
  const result = await userCollection.updateOne(filter, updateDoc);
  res.send(result);
})

//getting api for admin

app.get('/admin/:email', async (req, res) => {
  const email = req.params.email;
  const user = await userCollection.findOne({ email: email });
  const isAdmin = user.role === 'admin';
  res.send({ admin: isAdmin })
})



        
 //getting all reviews       
        app.get('/review' , async(req,res)=>{
            const query = {}
            const cursor= reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })
   //posting order
   
   app.post('/order', async(req,res)=>{
     const order = req.body
    //  const query = {userEmail:order.userEmail,userName:order.userName,phone:order.phone,address:order.address}
    //  const exist = await orderCollection.findOne(query)
    //  if(exist){
    //   return res.send({ success: false, order: exist })
    //  }
     const result = await orderCollection.insertOne(order)
     res.send({success:true,result})
   })

   //getting order

   app.get('/order' , async(req,res)=>{
     const email = req.query.email
     const query = {userEmail:email}
     const cursor =  orderCollection.find(query)
     const order =  await cursor.toArray()
     res.send(order)
   })

//inserting profile collection

app.post('/profile' , async(req,res)=>{
  const profile= req.body
  const result = await profileCollection.insertOne(profile)
  res.send({success:true,result})
})


//updating profile

// app.put('/profile' , async)



//getting review

app.post('/review' , async(req,res)=>{
  const review = req.body
  const result = await reviewCollection.insertOne(review)
  res.send({success:true,result})
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