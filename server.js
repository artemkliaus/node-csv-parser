const http = require('http');

const server = http.createServer();
const pages = ['', 'about', 'movies'];
server.on('request', (req, res) => {
    const { url } = req;
    const urlLevels = url.split('/');

    if (pages.includes(url)) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });
    }

    if (urlLevels[1] === pages[0]) {
        res.write('<h1>The main page</h1>');
        res.end();
    } else if (urlLevels[1] === pages[1]) {
        res.write('<h1>The about page</h1>');
        res.end();
    } else if (urlLevels[1] === pages[2]) {
        const { parse } = require('csv-parse');
        const fs = require('fs');
        const movies = [];

        fs.createReadStream('./csv/IMDBMovieData.csv')
            .pipe(parse())
            .on('data', (data) => {
                if (!isNaN(parseInt(data[0], 10))) {
                    movies.push(data[1]);
                }
            })
            .on('end', function () {
                if (urlLevels.length === 3) {
                    const position = Number(urlLevels[2]) + 1;
                    res.write(`<h1>The ${position} movie page</h1>`);
                    res.write(movies[urlLevels[2]]);
                } else {
                    res.write('<h1>The movies page</h1>');
                    res.write(JSON.stringify(movies));
                }
                res.end();
            });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.write('<h1>The 404 page</h1>');
        res.end();
    }

});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Start to listening to port ${PORT}`);
});