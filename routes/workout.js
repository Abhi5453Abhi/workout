const { Router } = require('express');
const UserModel = require('../models/user');
const WorkoutModel = require('../models/workout');

const router = Router();

router.get('/add', (req, res) => {
    return res.render('addWorkout', {
        user: req.user
    });
})

router.post('/', async (req, res) => {
    const { muscleName, exerciseName, weight, reps } = req.body;
    await WorkoutModel.create({
        muscleName,
        exerciseName,
        weight,
        reps,
        createdBy: req.user._id
    })
    return res.redirect('/');
})

module.exports = router;