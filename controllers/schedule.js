const Schedule = require('../models/Schedule');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getSchedule = async (req, res, next) => {
    try {
        // Extract doctorId or patientId from the URL parameters
        const { id } = req.params;

        // Find schedules where either doctorId or patientId matches the provided id
        const schedules = await Schedule.find({ $or: [{ doctorId: id }, { patientId: id }] });

        if (schedules.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No schedules found' });
        }

        res.status(StatusCodes.OK).json({ schedules });
    } catch (error) {
        next(error);
    }
};

const requestSchedule = async (req, res) => {
    // Extract patient and doctor IDs from request body
    const { id } = req.params;
    const { fullName, email, number, doctorId, date, time, online, f2f } = req.body;

    try {
        // Create a new schedule entry
        const schedule = await Schedule.create({ patientId: id, doctorId, fullName, email, number, date, time, online, f2f });
        res.status(StatusCodes.CREATED).json({ schedule });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const verifySchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { patientId, status } = req.body;

        const schedule = await Schedule.findOne({ doctorId: id, patientId });

        if (!schedule) {
            throw new NotFoundError('No schedule found');
        }

        let update = { $set: { status } };

        if (status === 'Accepted') {
            update.$set.localDate = schedule.date;
            update.$set.date = schedule.date;
            update.$set.localTime = schedule.time;
            update.$set.time = schedule.time;
        } else if (status === 'Rejected' || status === 'Dismiss') {
            if (schedule.localDate !== null || schedule.localTime !== null && status === 'Dismiss') {
                update.$set.date = schedule.localDate;
                update.$set.time = schedule.localTime;
                update.$set.online = !schedule.online;
                update.$set.status = 'Accepted'
            } else {
                update.$set.localDate = null;
                update.$set.localTime = null;
            }
        } else if (status === 'Request') {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Status: 'Request' is not valid" });
        }

        const updatedSchedule = await Schedule.findOneAndUpdate(
            { doctorId: id, patientId },
            update,
            { new: true }
        );

        if (!updatedSchedule) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'No schedules found' });
        }

        res.status(StatusCodes.OK).json({ schedule: updatedSchedule });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const editSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, status, online } = req.body; // New date for rescheduling

        // Find the schedule by ID
        const schedule = await Schedule.findOne({ patientId: id });

        if (!schedule) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Schedule not found' });
        }

        // Check if the schedule status is 'Accepted'
        if (schedule.status !== "Accepted") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Cannot reschedule. Schedule status is not "Accepted"' });
        }

        // Update the schedule with the new date
        schedule.online = online;
        schedule.date = date;
        schedule.time = time;
        schedule.status = status;
        await schedule.save();

        res.status(StatusCodes.OK).json({ message: 'Schedule successfully updated' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Implement other controller methods for accepting/rejecting and rescheduling appointments

module.exports = { getSchedule, requestSchedule, verifySchedule, editSchedule };