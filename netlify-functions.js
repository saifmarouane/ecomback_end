const serverless = require('serverless-http');
const app = require('./src/app'); // chemin correct depuis functions file
module.exports.handler = serverless(app);