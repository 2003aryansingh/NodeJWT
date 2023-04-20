const router = require('express').Router();
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { registerValidation, loginValidation } = require("../validation");
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");

dotenv.config();


router.post('/register', async (req,res)=>{
    
    //validating the user credentials 
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if email already exists 
    const emailExist = await User.findOne({email: req.body.email});
    console.log(emailExist);
    if(emailExist) return res.status(400).send("Email already exists");


    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password, salt);
    

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req,res)=> {
    //validating the user credentials 
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if email already exists 
    const user = await User.findOne({email: req.body.email});
    // console.log(emailExist);
    if(!user) return res.status(400).send("Email or password is wrong");

    //CHECK the password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid Password");

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});







module.exports = router;