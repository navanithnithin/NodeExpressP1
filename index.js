const express = require("express");
const users = require("./MOCK_DATA (1).json")
const app = express();
const PORT = 3000;
const fs = require("fs");
// const {}= require('mongodb')
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/test')
.then(() => console.log("mongoose connect"))
.catch(()=> console.log("Mongoose Error"))
// schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
const User = mongoose.model("User", userSchema)

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log("middleware 1");
    // return res.json({msg: "middleware 1"});
    next();
});
app.use((req, res, next) => {
    console.log("middleware 2");
    return res.json({ msg: "middleware 2" });
    // next();
})

//route

app.get('/users', (req, res) => {
    const html = `
    <ul>${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>`
    return res.send(html);
});

app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.route('/api/users/:id').get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})
    .patch((req, res) => {
        return res.json({ status: "Pending" })
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        return res.json({ status: " user deleted successfully" })
    })

app.post('/api/users', (req, res) => {
    const body = req.body;
    console.log("Body ", body);
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users), (err, data) => {
        return res.json({ status: "Success" })
    })
})
app


app.listen(PORT, () => console.log("Port started"))