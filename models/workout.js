const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const workoutSchema = new Schema({
    muscleName: {
        type: String,
        required: true
    },
    exerciseName: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    reps: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
},
    {
        timestamps: true
    }
)

const Workout = model('workout', workoutSchema);
module.exports = Workout;