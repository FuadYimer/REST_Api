const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const asyncHandeler = require('express-async-handler')
const User = require('../models/userModel')
// @desc Register user
// @route POST  /api/users
// @access Public
const registerUser = asyncHandeler(async (req, res) =>{
    const {name, email, password} = req.body

    if (!name || !email || !password){
        res.status(400)
        throw new Error('Please add all the Fild')
    }
    // check if user exists 
    const userExist = await User.findOne({email})
    if (userExist){
        res.status(400)
        throw new Error ('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user 
    const user  = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new  Error ('Invalid user data ')
    }
   
}
)

// @desc Authenticate a user
// @route POST  /api/users/login
// @access Public
const loginUser = asyncHandeler(async(req, res) =>{
    const {email, password } = req.body 
    
    // find user emil 
    const user = await User.findOne({email})
    // compare user password with hashed password

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
     }
    else{
        res.status(400)
        throw new  Error ('Invalid Credentials')
    }
})



// @desc Get User data
// @route GET  /api/users/me
// @access Private
const getMe = asyncHandeler(async(req, res) =>{
    const {_id, name,email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })
})



// Generate JWT 
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,

}