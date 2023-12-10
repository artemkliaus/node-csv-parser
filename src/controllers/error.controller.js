function getNotFound(req, res) {
    res.send('<h1>The 404 page</h1>');
}

module.exports = {
    getNotFound,
};