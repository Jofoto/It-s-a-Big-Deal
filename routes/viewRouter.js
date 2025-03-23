const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// router.get('/login-success', (req, res) => {
//     res.send('<h2>Login Successful! 🎉</h2><a href="/api/v1/users/login">Go to Home</a></form>');
// });

router.get('/user', (req, res) => {
    // if (!req.user) {
    //     return res.redirect('/login'); // Redirect if user is not logged in
    // }
    res.render('user', { user: req.session.user });
});

module.exports = router;
