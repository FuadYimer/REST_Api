const asyncHandeler = require('express-async-handler')


const Goal  = require('../models/goalModel')


// @desc Get goals
// @route GET  /api/goals
// @access Private
const getGoals = asyncHandeler(async (req, res) => {

    const goals = await Goal.find()
    res.status(200).json(goals)
})



// @desc Set goals
// @route POST  /api/goals
// @access Private
const postGoals =asyncHandeler( async (req, res) => {
    if (!req.body.text){
        res.status(400)
        throw new Error ('Please add text field')
    }
    const goal = await Goal.create({
        text: req.body.text
    })
    res.status(200).json(goal)
})


// @desc Update goals
// @route PUT  /api/goals/:id
// @access Private
const updateGoals = asyncHandeler( async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal){
        res.status(400)
        throw new Error('Goal Now Found')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedGoal)
})



// @desc Delete goals
// @route DELETE  /api/goals/:id
// @access Private
const deleteGoals =asyncHandeler( async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal){
        res.status(400)
        throw new Error('Goal Now Found')
    }

    await goal.remove()

    res.status(200).json({id: req.params.id})
})



module.exports = {
    getGoals,
    postGoals,
    updateGoals,
    deleteGoals
}