const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const db = require("./firebase");

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  try {
    // Check if user already exists
    const userRef = db.collection('Users').doc(username);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
        return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.set({
        username,
        password: hashedPassword,
    });

    res.status(201).send("User registered successfully");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error during registration");
  }
});

app.post("/login", async (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  try {
    const userRef = db.collection("Users").doc(username);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return res.status(400).send("User not found");
    }

    const user  = userDoc.data();
    const validPassword = await bcrypt.compare(password, user.password);

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