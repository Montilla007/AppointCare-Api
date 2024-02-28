const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const getHome = async (req, res) => {
    try {
        const userId = req.user.userId; // Accessing the user ID from the token
        const user = await User.findById(userId); // Fetching user detail by user ID
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}


const createHome = async (req, res) => {
    
}

const updateHome = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!user) {
            // If user is not found, return a 404 error
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        // If user is updated successfully, send the updated user as a response
        res.status(StatusCodes.OK).json({ user });
    } catch (err) {
        // Handle errors
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

const deleteHome = async (req, res) => {
    res.send('Delete Home')
}

module.exports = {
    getHome,
    createHome,
    updateHome,
    deleteHome,
}
