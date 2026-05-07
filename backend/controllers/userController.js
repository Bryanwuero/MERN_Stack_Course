const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @des cRegister a new user
// @route POST /api/users
// @access Private 
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {}

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill in all the inputs')
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error('user already register with this email')
    }

    // Hash passwd
    const salt = await bcrypt.genSalt(10)
    const hashPsswd = await bcrypt.hash(password, salt)

    // Create the user 
    const user = await User.create({ name, email, password: hashPsswd })

    if (user) {
        res.status(201)
        res.json({ _id: user.id, name: user.name, email: user.email, token: genrateToken(user.id) })
    } else {
        res.status(400)
        throw new Error('There was an error creating user')
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    // bcript password
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: genrateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Incorrect password or email')
    }
})

// @desc Current login user
// @route GET /api/users/me
// @access Private 
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200)
    res.json({
        id: _id,
        name,
        email
    })
})

// Generate JWT token 

const genrateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

}

module.exports = { registerUser, loginUser, getMe }