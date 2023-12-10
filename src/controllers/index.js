const { getMovies, getMovie, addReviewForMovie } = require('./movies.contoller');
const { getNotFound } = require('./error.controller');
const { getAbout } = require('./about.controller');
const { getMain } = require('./main.controller');

module.exports = {
    getMovies,
    getMovie,
    addReviewForMovie,
    getNotFound,
    getAbout,
    getMain,
}