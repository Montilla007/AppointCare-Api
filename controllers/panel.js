const User = require('../models/User'); // Assuming User model includes doctor-related fields and methods
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const verifyDoctor = async (req, res) => {
    try {
        // Extract doctor ID and status from request parameters
        const { id: doctorId } = req.params;
        const { status } = req.body;

        // Verify if the provided status is valid
        if (!['Accept', 'Reject'].includes(status)) {
            throw new BadRequestError('Invalid status provided');
        }

        // Find the doctor by ID
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            throw new BadRequestError('Doctor not found');
        }

        // Update the doctor's status
        doctor.status = status;
        await doctor.save();

        res.status(StatusCodes.OK).json({ message: `Doctor ${status}ed successfully` });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};


const acceptDoctor = async (req, res) => {
    try {
        // Find all doctors with status 'accept'
        const acceptedDoctors = await User.find({ role: 'Doctor', status: 'Accepted' });
        res.status(StatusCodes.OK).json(acceptedDoctors);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const rejectDoctor = async (req, res) => {
    try {
        // Find all doctors with status 'reject'
        const rejectedDoctors = await User.find({ role: 'Doctor', status: 'Rejected' });
        res.status(StatusCodes.OK).json(rejectedDoctors);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const pendingDoctor = async (req, res) => {
    try {
        // Find all doctors with status 'pending'
        const pendingDoctors = await User.find({ role: 'Doctor', status: 'Pending' });
        res.status(StatusCodes.OK).json(pendingDoctors);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
const deleteDoctor = async (req, res) => {
    try {
        // Extract doctor ID from request parameters
        const doctorId = req.params.id;

        // Find the doctor by ID
        const doctor = await User.deleteOne({_id: doctorId});
        if (doctor.deletedCount === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Doctor not found' });
          }

        res.status(StatusCodes.OK).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

module.exports = { deleteDoctor, verifyDoctor, acceptDoctor, rejectDoctor, pendingDoctor };
