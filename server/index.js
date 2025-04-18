const express = require("express")
const app = express();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();


const port = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
    try{
        await client.connect();
        console.log("Database Connection Successfully !");
        return client;
    } catch(err) {
        console.log("Database Connection Faild !");
    }
}

connectDB();



app.get("/data", async (req, res) => {
    try {
        const db = client.db("test");
        const collection = db.collection("todo_app");

        const todos = await collection.find().sort({ createdAt: -1 }).toArray();
        
        const formattedTodos = todos.map(todo => ({
            id: todo._id,
            text: todo.text,
            completed: todo.completed,
            createdAt: todo.createdAt
        }));

        res.status(200).json({ 
            success: true,
            data: formattedTodos 
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ 
            success: false,
            message: "Error retrieving data",
            error: error.message 
        });
    }
});


app.post("/store", async(req, res) => {
    try{
        console.log(req.body);
        const db = client.db("test");
        const collections = db.collection("todo_app");
    
        const { text, completed } = req.body;
        const newTodo = {
            text: text,
            completed: completed || false,
            createdAt: new Date(),
        }
        const result = await collections.insertOne(newTodo);;
    
        res.status(201).json({ 
            id: result.insertedId, 
            text: newTodo.text,
            completed: newTodo.completed,
            message: "Data stored successfully" 
        });   
    } catch(err) {
        res.status.json({ message: "Error store data", err });
    }
});

app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const db = client.db("test");
        const collections = db.collection("todo_app");

        const result = await collections.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Error deleting todo", error: error.message });
    }
})

app.put('/toggle/:id', async(req, res) => {
    const { id } = req.params;
    const db = client.db("test");
    const collections = db.collection("todo_app");
    const todo = await collections.findOne({ _id: new ObjectId(id)});

    const result = await collections.updateOne(
        {_id : new ObjectId(id)},
        {$set : { completed : !todo.completed  }}
    );

    if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Not Found" });
    }

    res.json("toggle todo successfully");

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})