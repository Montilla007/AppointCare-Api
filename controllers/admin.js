const Admin = require('../models/Admin')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
  const { authentication } = req.body;

  if (authentication !== process.env.ADMIN) {
    throw new UnauthenticatedError('Invalid Authentication');
  }

  try {
    const admin = await Admin.create({ ...req.body });
    const token = admin.createJWT();
    res.status(StatusCodes.CREATED).json({ admin: { admin: admin.username }, token });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const admin = await Admin.findOne({ email })
  if (!admin) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await admin.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = admin.createJWT()
  res.status(StatusCodes.OK).json({ admin: { admin: admin.username }, token })
}

module.exports = {
  register,
  login,
}