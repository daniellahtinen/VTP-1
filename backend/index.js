const express = require('express');
const bodyParser = require('body-parser');
const plansApp = require('./plans');
const setupDocumentsRoute = require('./documents');
const setupDraftsRoute = require('./drafts');
const setupInspectionInformationRoute = require('./inspection_information');
const setupTargetTimeframesRoute = require('./target_timeframes');
const setupSchedulingRoute = require('./scheduling');

const app = express();

// Add this middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

app.use('/plans', plansApp);

setupDocumentsRoute(app); // Call the exported function from documents.js, passing in the app instance
setupDraftsRoute(app);
setupInspectionInformationRoute(app);
setupTargetTimeframesRoute(app);
setupSchedulingRoute(app); // manually added (T. Anttila)

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = server;
