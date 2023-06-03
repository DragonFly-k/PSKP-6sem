const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const tsRoute = require('./ts');
const swaggerConfig = require('./swagger.json');
const app = express();

app.use(bodyParser.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
app.use('/ts', tsRoute);

app.listen(3000);
