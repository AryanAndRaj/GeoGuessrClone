const {Firestore} = require("@google-cloud/firestore");

// Initialize Firestore with service account credentials
const db = new Firestore({
  projectId: "geoguessrclone-433920",
  keyFilename: "./serviceAccountKey.json",
});

module.exports = {db};
