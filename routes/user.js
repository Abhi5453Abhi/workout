const { Router } = require('express');
const UserModel = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await UserModel.matchPasswordAndGenerateToken(email, password);
        console.log({ token });
        return res.cookie('token', token).redirect('/');
    } catch (err) {
        return res.render('signin', {
            error: err
        })
    }

})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await UserModel.create({
        fullName,
        email,
        password
    })
    const token = await UserModel.matchPasswordAndGenerateToken(email, password);
    return res.cookie('token', token).redirect('/');
})

module.exports = router;