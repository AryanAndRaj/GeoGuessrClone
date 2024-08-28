const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const users = []; // This is our "database"

app.use(express.json());


app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Usernamed and password required");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // check if user already exists
        if (users.find((user) => user.username === username)) {
            return res.status(400).send("User already exists");
        }
        users.push({ username, hashedPassword });
        res.status(201).send("User registered successfully");
    } catch (e) {
        console.error(e);
        res.status(500).send("Error during registration");
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send(400).send("Username and password required");
    }

    try {
        const user = users.find((user) => user.username === username);

        if (!user) {
            return res.status(400).send("Cannot find user");
        }

        const validPassword = await bcrypt.compare(password, user.hashedPassword);
        if (!validPassword) {
            return res.status(400).send("Invalid password");
        }

        res.send("Login successful");
        
    } catch (e) {
        console.error(e);
        res.status(500).send("Error during login");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});