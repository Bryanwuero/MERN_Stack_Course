const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get goals
// @route GET /api/goals
// @access Private 
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
    res.status(200).json(goals)
})

// @desc Get goals
// @route POST /api/goals
// @access Private 
const setGoals = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please add a text value')

    }
    const goals = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goals)
})

// @desc Get goals
// @route PUT /api/goals/:id
// @access Private 
const updateGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!goals) {
        res.status(404)
        throw new Error('goal not found')
    }

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }
    if (goals.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updateGoal)
})

// @desc Get goals
// @route DELETE /api/goals/:id
// @access Private 
const deleteGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)
    const user = await User.findById(req.user.id)

    if (!goals) {
        res.status(400)
        throw new Error('Goal id not found')
    }

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }
    if (goals.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await goals.deleteOne()

    res.status(200).json({ id: req.params.id })
})


module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}