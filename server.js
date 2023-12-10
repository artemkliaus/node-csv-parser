const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const {
    getMain,
    getAbout,
    getMovies,
    addReviewForMovie,
    getMovie,
    getNotFound,
} = require('./src/controllers');

app.use((req, res, next) => {
    fs.appendFile('./src/assets/site.log', req.url + ',', function (err) {
        if (err) throw err;
    });
    next();
});
app.use(express.json());

app.get('/', getMain);
app.get('/about', getAbout);
app.get('/movies', getMovies);
app.get('/movies/:movieId', getMovie);
app.post('/movies/:movieId', addReviewForMovie);

app.get('*', getNotFound);

app.listen(PORT, () => {
    console.log(`Start to listening the port ${PORT}`);
});