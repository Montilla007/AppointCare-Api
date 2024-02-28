const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const users = async (req, res) => {
    try {
      const people = await User.find({});
      res.status(StatusCodes.OK).json(people);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  const usersId = async (req, res) => {
    try {
      const userId = req.params.id; // Accessing the route parameter (ObjectId)
      const user = await User.findById(userId); // Fetching user detail by ObjectId
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
      res.status(StatusCodes.OK).json(user);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }
  const usersUpdate = async (req, res) => {
    try {
      const userId = req.params.id;
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
  };
  const usersDelete = async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Assuming you have a User model with a deleteOne method
      const deletedUser = await User.deleteOne({ _id: userId });
  
      if (deletedUser.deletedCount === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
  
      res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

module.exports = {
    users, usersId, usersUpdate, usersDelete

}
