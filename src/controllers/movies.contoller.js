const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const REVIEWS_FILE = path.join(__dirname, '..', 'assets', 'reviews.json');
const CSV_PATH = path.join(__dirname, '..', 'assets', 'IMDBMovieData.csv');
const db = {
    movies: [],
    isFilled: false,
};

function getMovies(req, res) {
    fs.createReadStream(CSV_PATH)
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
}

function getMovie(req, res) {
    const { movieId } = req.params;

    fs.createReadStream(CSV_PATH)
        .pipe(parse())
        .on('data', setMovies)
        .on('end', function () {
            const rawdata = fs.readFileSync(REVIEWS_FILE);
            const reviews = JSON.parse(rawdata);
            const movie = db.movies[movieId - 1];
            const reviewsForMovie = reviews.movies[movieId];
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
                    <div>reviews: ${reviewsForMovie ? reviewsForMovie.map(m => m.review).join(', ') : 'not found'}</div>
                `;
                res.send(html);
            } else {
                html = '<h1>The movie does not exist</h1>';
                res.status(404).send(html);
            }
        });
}

function addReviewForMovie(req, res) {
    const { movieId } = req.params;
    const newReview = req.body;

    if (!newReview.review) {
        return res.status(400).json({ error: 'Missing the review field!'});
    }

    let rawdata = fs.readFileSync(REVIEWS_FILE);
    let reviews = JSON.parse(rawdata);
    const movie = reviews.movies[movieId];

    if (!movie) {
        reviews.movies[movieId] = [{id: 0, ...newReview}];
    } else {
        movie.push({id: movie.length, ...newReview});
    }

    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews));
    res.status(200).send({ text: 'Review is saved!'});
}

function setMovies(data) {
    if (!db.isFilled && !isNaN(parseInt(data[0], 10))) {
        db.movies.push(data);
    }
}

module.exports = {
    getMovies,
    getMovie,
    addReviewForMovie,
};
