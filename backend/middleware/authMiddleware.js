const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from headers
            token = req.headers.authorization.split(' ')[1]

            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            /** @type {import('jsonwebtoken').JwtPayload} */
            const decodedPayload = typeof decoded === 'string' ? {} : decoded

            // Get user from token
            req.user = await User.findById(decodedPayload.id).select('-password')
            next()
        } catch (error) {
            console.log('error', error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, Not token')
    }
})

module.exports = { protect }