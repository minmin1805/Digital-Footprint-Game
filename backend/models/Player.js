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
    safepostDetected: {
        type: Number,
        default: 0
    },
    safepostTotal: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: null
    },
    /** Optional snapshot updated from telemetry session_completed (not source of analytics). */
    dfdLastSessionCompletedAt: {
        type: Date,
        default: null,
    },
    dfdLastCategoriesDistinct: {
        type: Number,
        default: null,
    },
}, { timestamps: true })


const Player = mongoose.model('Player', playerSchema);

export default Player;
