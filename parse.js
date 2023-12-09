const { parse } = require('csv-parse');
const fs = require('fs');

fs.createReadStream('./csv/IMDBMovieData.csv')
    .pipe(parse())
    .on('data', (data) => {
        console.log(data);
    });