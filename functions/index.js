const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyB-DDEV1hBQLyRNKOXWSx-Xd7o8m-R5dMA",
  authDomain: "socialmediaapp-513bb.firebaseapp.com",
  databaseURL: "https://socialmediaapp-513bb.firebaseio.com",
  projectId: "socialmediaapp-513bb",
  storageBucket: "socialmediaapp-513bb.appspot.com",
  messagingSenderId: "210918323012",
  appId: "1:210918323012:web:115e8dcad70d491a"
};

const express = require("express");
const app = express();

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

exports.api = functions.https.onRequest(app);
