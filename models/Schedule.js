const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    number: {
        type: String,
        required: [true, 'Please provide number'],
        maxLength: 12,
      },
    online: {
        type: Boolean,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    localTime: {
        type: String,
        default: null
    },
    localDate: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Request', 'Dismiss'],
        default: 'Pending'
    }
    // Other schedule details
});

module.exports = mongoose.model('Schedule', scheduleSchema);