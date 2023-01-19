const asyncHandeler = require('express-async-handler')


const Goal  = require('../models/goalModel')
const User  = require('../models/userModel')


// @desc Get goals
// @route GET  /api/goals
// @access Private
const getGoals = asyncHandeler(async (req, res) => {

    //find all goals
    // const goals = await Goal.find()

    // find specific token by the user 
    const goals = await Goal.find({user: req.user.id})

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
        text: req.body.text,
        user: req.user.id,
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

    const user = await User.findById(req.user.id)

    // check for user 
    if (!user){
        res.status(401)
        throw new Error ('User Not Found')
    }

    // Make sure the login user matches the goal user 
    if (goal.user.toString()!== user.id){
        res.status(401)
        throw new Error ('User Not authorized')
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

    const user = await User.findById(req.user.id)

    // check for user 
    if (!user){
        res.status(401)
        throw new Error ('User Not Found')
    }

    // Make sure the login user matches the goal user 
    if (goal.user.toString()!== user.id){
        res.status(401)
        throw new Error ('User Not authorized to delete')
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