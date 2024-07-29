const express = require("express");
const users = require("./MOCK_DATA (1).json");
const app = express();
const PORT = 3000;
const fs = require("fs");
// const {}= require('mongodb')
const mongoose = require("mongoose");
const { type } = require("os");
mongoose.connect('mongodb://localhost:27017/test')
    .then(() => console.log("mongoose connect"))
    .catch(() => console.log("Mongoose Error"))
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
    },
    gender: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    }
}, { timestamps: true });
const User = mongoose.model("User", userSchema)

app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log("middleware 1");
    // return res.json({msg: "middleware 1"});
    next();
});
app.use((req, res, next) => {
    console.log("middleware 2");
    // return res.json({ msg: "middleware 2" });
    next();
})

//route

app.get('/users', async (req, res) => {
    const allDbUserData = await User.find({})
    const html = `
    <ul>${allDbUserData.map((user) => `<li>${user.firstName}</li>`).join("")}
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
    .patch(async (req, res) => {
        await User.findByIdAndUpdate(req.params.id, {firstName: "Nithin"});
        return res.json( {status: "Pending"})
    })
    .delete(async (req, res) => {
        await User.findOneAndDelete(req.params.id)

        return res.json({ status: " user deleted successfully" })
    })

app.post('/api/users', async (req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.last_name || !body.gender || !body.email || !body.job_title) {
        return res.status(400).json({ msg: " All fields are required" })
    }
    // console.log("Body ", body);
    // users.push({ ...body, id: users.length + 1 });
    // fs.writeFile('./MOCK_DATA (1).json', JSON.stringify(users), (err, data) => {
    //     return res.json({ status: "Success" })
    // });
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        gender: body.gender,
        email: body.email,
        jobTitle: body.job_title
    });

    return res.status(201).json({ msg: "Success" });

})
app


app.listen(PORT, () => console.log("Port started"))