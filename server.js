'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { response } = require('express');

const app = express();
app.use(cors());

const getWeather = require('./weather');
const getMovies = require('./movies')

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
    response.send('Hey your default endpoint is working');
});


app.get('/weather', getWeather);
app.get('/movies', getMovies);

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error)
})

// turns the server on to the port specified
app.listen(PORT, () => console.log(`listening on ${PORT}`))