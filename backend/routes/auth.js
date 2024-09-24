const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JET_SECRECT = 'anasisagoodb$oy';

//Create a User using : Post "/api/auth/createuser". no login required
router.post('/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email ').isEmail(),
    body('password', 'Password should be at least 5 character ').isLength({ min: 5 })
  ],
  async (req, res) => {
    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    try {
      //check user with email exiest already
      let user = user.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: 'sorry user with this email already exists' })
      }//create a new user
      //adding salt and converting password to hash
      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(req.body.email,salt)
      user = await User.create({
        name: req.body.name,
        email: secpassword,
        password: req.body.password,
      })
      // id from data base table
      const data = {
        user:{
          id: user.id,
        }
      }
      //JWT 'token' data = authtoken
      const authtoken = jwt.sign(data,JET_SECRECT) 
      
      // res.json(user)
      res.json({authtoken})
    } catch (error) {
      console.error(error.message)
      res.status(500).send('some error occured')
    }
  })
module.exports = router