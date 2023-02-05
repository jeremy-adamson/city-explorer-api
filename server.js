'use strict'

require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { response } = require('express');
app.use(cors());

const PORT = process.env.PORT || 3002;

const lists = require('./data/weather.json');

// default home route
app.get('/', (request, response) => {
    response.send('Hey your default endpoint is working');
});

//sends back whole list 
app.get('/list', (req, res) => {
    res.send(lists);
})

app.get('/weather', getWeather);

async function getWeather (req, res, next) {
    try {
        let city = req.query.city;
        let cityForecast = new Forecast(city);
        let formattedForecast = cityForecast.getWeather();
        res.status(200).send(formattedForecast);
    }
    catch (error) {
        next(error)
    }
}

class Forecast {
    constructor(city) {
        let cityForecast = lists.find(element => element.city_name === city);

        this.weather = cityForecast;
    }

    getWeather() {
        return this.weather.data.map(element => {
            return { date: element.valid_date, description: element.weather.description }
        })
    }
}

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send(error)
})

// turns the server on to the port specified
app.listen(PORT, () => console.log(`listening on ${PORT}`))