// const express = require('express');
// const { generateShortUrl } = require('../controller//urlcontroller');
// const router = express.Router();

// router.post("/", generateShortUrl)
// module.exports = router;


const express = require('express');
const router = express.Router();
const urlController = require('../controller/urlcontroller')

// Show form
router.get('/', urlController.renderForm);

// Handle form submission
router.post('/', urlController.createShortUrl);

// Handle redirection
router.get('/:id', urlController.redirectUrl);

module.exports = router;
