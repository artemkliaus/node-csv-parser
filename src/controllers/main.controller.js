const path = require('path');

function getMain(req, res) {
    res.render('partials/layout/layout.ejs');
}

module.exports = {
    getMain,
};