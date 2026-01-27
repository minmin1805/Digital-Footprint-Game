import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    playerName: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        default: 0
    },
    totalPossible: {
        type: Number,
        default: 5,
    },
    categoriesFound: {
        type: [String],
        default: []
    },
    playingTimeSeconds: {
        type: Number,
        default: 0
    },

}, { timestamps: true })


const Player = mongoose.model('Player', playerSchema);

export default Player;
