require("dotenv").config();
const express = require('express');
const path = require('path');
const userRoute = require('./routes/user');
const workoutRoute = require('./routes/workout');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const WorkoutModel = require('./models/workout');


//Connect mongodb
mongoose.connect(process.env.MONGO_URL).then(e => console.log('Mongodb connected'));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(__dirname + '/public'));

app.use('/user', userRoute);
app.use('/workout', workoutRoute);

app.get('/', async (req, res) => {
    console.log({ mongourl: process.env.MONGO_URL });
    let formattedWorkouts = null;
    if (req.user) {
        let query = { createdBy: req.user._id };
        if (req.query.date) {
            query = {
                ...query, "createdAt": {
                    "$gte": new Date(req.query.date + "T00:00:00.000Z"),
                    "$lt": new Date(new Date(req.query.date).getTime() + 24 * 60 * 60 * 1000)
                }
            }
        }
        workouts = await WorkoutModel.find(query).sort({ 'createdAt': -1 });
        formattedWorkouts = workouts.map(workout => ({
            ...workout._doc,
            createdAt: workout.createdAt.toISOString().split('T')[0]
        }))
    }
    res.render('home', {
        user: req.user,
        workouts: formattedWorkouts
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        user: req.user
    });
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));