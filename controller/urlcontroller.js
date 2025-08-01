const Url = require('../model/urlmodel');
const { nanoid } = require('nanoid');

exports.renderForm = (req, res) => {
    res.render('home', { id: null });
};

exports.createShortUrl = async (req, res) => {
    try {
        const { url } = req.body;
        const id = nanoid(6);

        await Url.create({ originalUrl: url, shortId: id });

        res.render('home', { id }); // Renders page with short link
    } catch (err) {
        console.error('❌ Error creating short URL:', err.message);
        res.status(500).send('Internal Server Error');
    }
};

exports.redirectUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Url.findOne({ shortId: id });

        if (record) {
            res.redirect(record.originalUrl);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
