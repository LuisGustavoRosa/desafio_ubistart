const express = require('express')
const routes = require('./routes/routes')
const app = express()

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

require('./database')

app.use(express.json())
app.use(routes)

app.listen(3030)