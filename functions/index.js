const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sendGrid = require('@sendgrid/mail');

admin.initializeApp(functions.config().firebase);

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

exports.webApi = functions.https.onRequest(app);

app.get('/api', (req, res, next) => {
  res.send('API Status: Running')
});

app.post('/api/email', (req, res, next) => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.SENDGRID_EMAIL,
    from: `${req.body.name} <${process.env.SENDGRID_EMAIL}>`,
    replyTo: req.body.email,
    subject: `Portfolio Website Contact from ${req.body.name}`,
    text: req.body.message,
    html: `<p>${req.body.message}</p>`,
  }

  sendGrid.send(msg)
    .then(result => {
      console.log('SUCCESS: ', result);
      return res.status(200).json({
        success: true
      });
    })
    .catch(err => {
      console.log('error: ', err);
      res.status(401).json({
        success: false
      })
    })

});

