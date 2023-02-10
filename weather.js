'use strict'

const axios = require('axios');
const { response } = require('express');
const cache = require('./cache');

function getWeather(req, res, next) {
    const url1 = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.ACCUWEATHER_KEY}&q=${req.query.lat},${req.query.lon}`;
    const url2base = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/`;

    let url2 = '';

    const key = 'weather ' + req.query.city;

    if (cache[key] && (Date.now() - cache[key].timestamp < 600000)) {
        res.status(200).send(cache[key].data);
    }
    else {
        axios.get(url1)
            .then(data => {
                console.log(data.data.Key);
                return (url2base + data.data.Key + `?apikey=${process.env.ACCUWEATHER_KEY}`);})
            .then(url2 => {
                axios.get(url2)
                    .then(data => {
                        let formattedWeatherData = data.data.DailyForecasts.map(element => new Forecast(element));
                        cache[key] = {};
                        cache[key].timestamp = Date.now();
                        cache[key].data = formattedWeatherData;
                        console.log(formattedWeatherData);
                        res.status(200).send(formattedWeatherData);
                    })
            })
            .catch(error => next(error));
    }

    class Forecast {
        constructor(data) {
            this.date = data.Date;
            this.low = data.Temperature.Minimum.Value;
            this.high = data.Temperature.Maximum.Value;
            this.description = `High of: ${this.high}, Low of: ${this.low}`;
        }
    }
}
    module.exports = getWeather;