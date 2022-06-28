const express = require('express')
const routes = require('./routes/routes')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

require('./database')

app.use(express.json())
app.use(routes)
app.use('api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3030)