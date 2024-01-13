const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://perretjules:7Et1xC8T6Xj1SUb0@cluster0.iutuc6k.mongodb.net/"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error connecting to mongo db",error);
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});

const Todo = require("./models/todo");


//add todos
app.post("/todos", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.dueDate
    ) {
      return response.status(400).send({
        message: "send all required fields : title author and pubilshed year",
      });
    }
    const newTodo = {
      title: request.body.title,
      dueDate: request.body.dueDate,
    };
    const todo = await Todo.create(newTodo);
    return response.status(201).send(todo);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get all todos
app.get("/todos", async (request, response) => {
  try {
    const todos = await Todo.find({});
    return response.status(200).json({
      count: todos.lenght,
      data: todos,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// get todo by id
app.get("/todos/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const todo = await Todo.findById(id);
    return response.status(200).json(todo);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// update todo
app.put("/todos/:id", async (request, response) => {
  try {
    if (!request.body.title || !request.body.dueDate) {
      return response.status(400).send({
        message: "send all required fields : title author and pubilshed year",
      });
    }

    const { id } = request.params;

    const result = await Todo.findByIdAndUpdate(id, request.body);
    if (!result) {
      response.status(404).json({ message: "todo not found" });
    }
    return response.status(200).send({ message: "todo uptated succesfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//delete todo
app.delete("/todos/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Todo.findByIdAndDelete(id);
    if (!result) {
      response.status(404).json({ message: "todo not found" });
    }
    return response.status(200).send({ message: "todo has been deleted" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});