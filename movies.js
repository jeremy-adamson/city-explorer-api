'use strict'

const axios = require('axios');
const cache = require('./cache');

function getMovies(req, res, next) {
    const url = `https://api.themoviedb.org/3/movie/550?api_key=${MOVIE_API_KEY}`;

    const key = 'movies ' + city;
    if (cache[key] && (Date.now() - cache[key].timestamp) < 1800000) {
        res.status(200).send(cache[key].data);
    }
    else {
        axios.get(url)
            .then(data => {
                let formattedMovieData = data.map(element => new MovieInfo(element));
                cache[key] = {};
                cache[key].timestamp = Date.now();
                cache[key].data = formattedMovieData;
                res.status(200).send(formattedMovieData);
            })
            .catch(error => next(error));
    }
}

class MovieInfo {
    constructor(data){
        this.title = data.title;
        this.overview = data.overview;
        this.poster_url = data.url;
        this.released = data.released;
    }
}

module.exports = getMovies;