const express = require('express');
const users = require("./sample.json")
const cors = require ("cors");
const fs = require("fs");
const { json } = require('stream/consumers');


const app = express();
app.use(express.json());

const port = 8000;

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PATCH","DELETE"],
}))

// Display all Users
app.get("/users",(req,res)=>{
    return res.json(users);
})

// Delete user details

app.delete("/users/:id",(req,res) =>{
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);

    fs.writeFile("./sample.json",JSON.stringify(filteredUsers),(err,data) =>{
        return res.json(filteredUsers);
    })
})


// Update User
app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;

    let userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    if (name) users[userIndex].name = name;
    if (age) users[userIndex].age = age;
    if (city) users[userIndex].city = city;

    fs.writeFile("./sample.json", JSON.stringify(users), (err, data) => {
        return res.json({
            message: "User updated successfully",
            user: users[userIndex],
        });
    });
});

//Add new user

app.post("/users",(req,res) =>{
    let {name,age,city} = req.body;
    if(!name || !age || !city) {
        return res.status(400).json({
            message:"Please provide all required fields",
        })
    }
    let id = Date.now();
    users.push({id,name,age,city})

    fs.writeFile("./sample.json",JSON.stringify(users),(err,data) =>{
        return res.json({
            message:"User added successfully",
    })
    })
})

app.listen(port,(err)=>{
    console.log(`server is running port ${port}`);
})



