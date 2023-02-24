'use strict'

const axios = require('axios');
const cache = require('./cache');

function getMovies(req, res, next) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.city}`;

    console.log(url);

    const key = 'movies ' + req.query.city;
    if (cache[key] && (Date.now() - cache[key].timestamp) < 1800000) {
        res.status(200).send(cache[key].data);
    }
    else {
        axios.get(url)
            .then(data => {
                let formattedMovieData = data.data.results.map(element => new MovieInfo(element));
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
        this.poster_url = 'https://image.tmdb.org/t/p/w500' + data.poster_path;
        this.released = data.release_date;
    }
}

module.exports = getMovies;