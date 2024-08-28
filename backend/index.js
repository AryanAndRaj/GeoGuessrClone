const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const {db} = require("./firebase"); // Import Firestore instance
const {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} = require("@google-cloud/firestore");

app.use(cors());
app.use(express.json());

// Firestore collection reference
const usersRef = db.collection("Users"); // Correct usage of Firestore instance

app.post("/register", async (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  try {
    // Check if user already exists
    const userQuery = usersRef.where("username", "==", username);
    const userSnapshot = await userQuery.get();

    if (!userSnapshot.empty) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user to Firestore
    await usersRef.add({
      username: username,
      hashedPassword: hashedPassword,
    });

    res.status(201).send("User registered successfully");
  } catch (e) {
    console.error(e);
    res.status(500).send("Error during registration");
  }
});

app.post("/login", async (req, res) => {
  const {username, password} = req.body;
  console.log(req.body);
  console.log(username);
  console.log(password);
  if (!username || !password) {
    return res.status(400).send("Username and password required");
  }

  try {
    // Check if user exists
    const userQuery = usersRef.where("username", "==", username);
    const userSnapshot = await userQuery.get();

    if (userSnapshot.empty) {
      return res.status(400).send("Cannot find user");
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();

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
