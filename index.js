const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

mongoose.connect("mongodb+srv://malik:maqbool88@cluster0.50ntajr.mongodb.net/Database", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("Error in Connecting to Database:", err));

    
app.post("/sign_up", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;

        const newUser = new User({
            name: name,
            email: email,
        });

        await newUser.save();

        console.log("Record Inserted Successfully");
        return res.redirect('signup_successful.html');
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, resp) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

const port = 3010;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});



app.delete("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.sendStatus(200); 
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});



app.put("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        if (!updatedUser) {
            console.log("User not found");
            return res.status(404).send("User not found");
        }
        console.log("User updated successfully:", updatedUser);
        res.sendStatus(200); 
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});
