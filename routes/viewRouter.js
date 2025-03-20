const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/signup-success', (req, res) => {
    res.send('<h2>Signup Successful! 🎉</h2><a href="/">Go to Home</a>');
});


module.exports = router;
