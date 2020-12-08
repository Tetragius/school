const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

const mongoUrl = "mongodb://localhost:27017";
const mongoDbName = "test";

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", (req, res) => {
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const tasks = db.collection("tasks");
      return (await tasks.find().toArray()).map(
        ({ name, body, _id, createOn, modifyOn, withSign }) => ({
          name,
          body,
          createOn,
          modifyOn,
          withSign,
          id: _id,
        })
      );
    })
    .then((tasks) => res.json(tasks))
    .catch((error) => res.json({ error }));
});

app.put("/tasks", (req, res) => {
  const { name, body, withSign } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("tasks");
      return students.insertOne({
        name,
        body,
        withSign,
        createOn: new Date(),
      });
    })
    .then(() => res.send());
});

app.post("/tasks", (req, res) => {
  const { id, body, name, withSign } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const tasks = db.collection("tasks");
      return tasks.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { body, name, withSign, modifyOn: new Date() } }
      );
    })
    .then(() => res.send());
});

app.delete("/tasks", (req, res) => {
  const { id } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const tasks = db.collection("tasks");
      return tasks.findOneAndDelete({ _id: ObjectId(id) });
    })
    .then(() => res.send());
});

app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const tasks = db.collection("tasks");
      return tasks.findOne({ _id: ObjectId(id) });
    })
    .then((task) => res.json(task))
    .catch((error) => res.json({ error }));
});

app.get("/students", (req, res) => {
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      return (await students.find().toArray()).map(
        ({ name, className, pwd, _id, visitedOn }) => ({
          name,
          pwd,
          className,
          visitedOn,
          id: _id,
        })
      );
    })
    .then((students) => res.json(students))
    .catch((error) => res.json({ error }));
});

app.put("/students", (req, res) => {
  const { name, className, pwd } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      const classes = db.collection("classes");
      const _class = await classes.findOne({ name: className });
      if (!_class) {
        await classes.insertOne({ name: className });
      }
      return students.insertOne({
        name,
        pwd,
        login: name,
        className,
        createOn: new Date(),
      });
    })
    .then(() => res.send());
});

app.delete("/students", (req, res) => {
  const { id } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      return students.findOneAndDelete({ _id: ObjectId(id) });
    })
    .then(() => res.send());
});

app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      return students.findOne({ _id: ObjectId(id) });
    })
    .then((student) => res.json(student))
    .catch((error) => res.json({ error }));
});

app.post("/students/:id", (req, res) => {
  const { id } = req.params;
  const { taskId, result, comment, mark } = req.body;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      const tasks = db.collection("tasks");
      const task = await tasks.findOne({ _id: ObjectId(taskId) });
      const student = await students.findOne({ _id: ObjectId(id) });
      const studentTasks = student.tasks || [];

      if (studentTasks.find((st) => st.id.toString() === taskId.toString())) {
        const idx = studentTasks.findIndex(
          (st) => st.id.toString() === taskId.toString()
        );
        if (mark) {
          studentTasks[idx]["mark"] = mark;
          studentTasks[idx]["comment"] = comment;
        } else {
          studentTasks[idx]["result"] = result;
          studentTasks[idx]["finishedOn"] = new Date();
          studentTasks[idx]["isFinished"] = true;
        }
      } else {
        studentTasks.push({
          id: task._id,
          name: task.name,
          isFinished: false,
          withSign: task.withSign,
          assignOn: new Date(),
        });
      }
      students.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: {
            tasks: studentTasks,
          },
        }
      );
    })
    .then(() => res.json({}));
});

app.get("/students/:id/tasks", (req, res) => {
  const { id } = req.params;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const students = db.collection("students");
      return students.findOne({ _id: ObjectId(id) });
    })
    .then((student) => res.json(student.tasks || []))
    .catch((error) => res.json({ error }));
});

app.get("/classes/:name", (req, res) => {
  const { name } = req.params;
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const classes = db.collection("classes");
      return (
        await classes.find({ name: { $regex: `^te`, $options: "i" } }).toArray()
      ).map(({ name, _id }) => ({
        name,
        id: _id,
      }));
    })
    .then((classes) => res.json(classes))
    .catch((error) => res.json({ error }));
});

app.post("/login", (req, res) => {
  MongoClient.connect(mongoUrl)
    .then(async (client) => {
      const db = client.db(mongoDbName);
      const teachers = db.collection("teachers");
      const students = db.collection("students");
      const teacher = await teachers.findOneAndUpdate(
        req.body,
        {
          $set: { visitedOn: new Date() },
        },
        { returnNewDocument: true }
      );
      const student = await students.findOneAndUpdate(
        req.body,
        {
          $set: { visitedOn: new Date() },
        },
        { returnNewDocument: true }
      );
      return teacher.value || student.value;
    })
    .then(({ name, isAdmin, _id }) => res.json({ name, isAdmin, id: _id }))
    .catch((error) => res.json({ error }));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
