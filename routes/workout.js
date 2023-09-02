const { Router } = require('express');
const UserModel = require('../models/user');
const WorkoutModel = require('../models/workout');

const router = Router();

router.get('/add', (req, res) => {
    return res.render('addWorkout', {
        user: req.user
    });
})

router.get('/leaderboard', async (req, res) => {
    let query = {};
    if (req.query.date) {
        query = {
            ...query, "createdAt": {
                "$gte": new Date(req.query.date + "T00:00:00.000Z"),
                "$lt": new Date(new Date(req.query.date).getTime() + 24 * 60 * 60 * 1000)
            }
        }
    }
    const workouts = await WorkoutModel.find(query).sort({ 'createdAt': -1 }).populate('createdBy');
    return res.render('leaderboard', {
        user: req.user,
        workouts
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
    });
    return res.redirect('/');
})

module.exports = router;