const express = require('express');
const fs = require('fs');
const { parse } = require('csv-parse');
const app = express();
const db = {
    movies: [],
    isFilled: false,
};

app.use((req, res, next) => {
    console.log('This is middleware!');
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>The main page</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>The about page</h1>');
});

app.get('/movies', (req, res) => {

    fs.createReadStream('./csv/IMDBMovieData.csv')
        .pipe(parse())
        .on('data', setMovies)
        .on('end', () => {
            if (!db.isFilled) {
                db.isFilled = true;
            }

            const list = db.movies.map((movie) => `<li>${movie[1]}</li>`);
            res.send(`
                <h1>The movies page</h1>
                <ol>${list.join('')}</ol>
            `);
        });
});

app.get('/movies/:movieId', (req, res) => {
    const { movieId } = req.params;

    fs.createReadStream('./csv/IMDBMovieData.csv')
        .pipe(parse())
        .on('data', setMovies)
        .on('end', function () {
            const movie = db.movies[movieId - 1];
            let html;

            if (!db.isFilled) {
                db.isFilled = true;
            }

            if (movie) {
                const [position, name, janre, descr] = movie;
                html = `
                    <h1>The movie page</h1>
                    <h3>name: ${name}</h3>
                    <div>position: ${position}</div>
                    <div>janre: ${janre}</div>
                    <div>descr: ${descr}</div>
                `;
                res.send(html);
            } else {
                html = '<h1>The movie does not exist</h1>';
                res.status(404).send(html);
            }
        });
});

app.get('*', (req, res) => {
    res.send('<h1>The 404 page</h1>');
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Start to listening the port ${PORT}`);
});

function setMovies(data) {
    if (!db.isFilled && !isNaN(parseInt(data[0], 10))) {
        db.movies.push(data);
    }
}