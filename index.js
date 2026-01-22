// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .Instance Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and runMongoDB() function)
// 5. Routes
// 6. Server Startup (app.listen)
// ===========================================================

// 01
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config(); // Add this line must

// 02
const app = express();
const port = process.env.PORT || 5000;

// 03
app.use(express.json());
app.use(cors());

// 04
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const myDatabase = client.db("coffeeStoreDB");
    const coffeesCollection = myDatabase.collection("coffees");

    // ====================
    // === coffees api ====
    // ====================

    // read operation for all coffees
    app.get("/coffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // read operation for one coffee
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    // create operation
    app.post("/coffees", async (req, res) => {
      const doc = req.body;
      // console.log(doc);
      const result = await coffeesCollection.insertOne(doc);
      res.send(result);
    });

    // update opertaion
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
        },
      };
      const options = { upsert: true };

      const result = await coffeesCollection.updateOne(
        filter,
        updateDoc,
        options,
      );
      res.send(result);
    });

    // delete operation
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// 05
app.get("/", (req, res) => {
  res.send("server is running");
});

// 06
app.listen(port, () => {
  console.log(`the server is running on port : ${port}`);
});
