const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JET_SECRET = 'anasisagoodb$oy';

//Create a User using : Post "/api/auth/createuser". no login required
router.post('/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email ').isEmail(),
    body('password', 'Password should be at least 5 characters').isLength({ min: 5 })
  ],
  async (req, res) => {
    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user with email already exists
      let user = await User.findOne({ email: req.body.email }); // Use User instead of user
      if (user) {
        return res.status(400).json({ error: 'Sorry, user with this email already exists' });
      }

      // Create a new user by adding salt and converting password to hash
      const salt = await bcrypt.genSalt(10);
      const secpassword = await bcrypt.hash(req.body.password, salt); // Corrected: hash the password, not the email

      user = await User.create({
        name: req.body.name,
        email: req.body.email, // Store email directly here
        password: secpassword, // Store hashed password
      });

      // id from database table
      const data = {
        user: {
          id: user.id,
        },
      };

      // JWT 'token' data = authtoken
      const authtoken = jwt.sign(data, JET_SECRET); // Assuming JWT_SECRET is defined correctly

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('INTERNAL SERVER ERROR');
    }
  }
);


//Authenticate a User using : Post "/api/auth/login". no login required

router.post('/login',
  [
    body('email', 'Enter a valid email ').isEmail(),
    body('password', 'Password scannot be blank ').exists()
  ],
  async (req, res) => {

    //if there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
      
      const {email, password} = req.body;
      try{
        let user = await User.findOne({email});
        if(!user){
          return res.status(400).json({error:'Please try to login with correct credentials'})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
          return res.status(400).json({error:'Please try to login with correct credentials'})
        }

         // id from data base table
      const data = {
        user:{
          id: user.id,
        }
      }
      //JWT 'token' data = authtoken
      const authtoken = jwt.sign(data,JET_SECRET) 
      
      // res.json(user)
      res.json({authtoken})
      }
      catch(error){
        console.error(error.message)
      res.status(500).send('INTERNAT SERVER ERROR')
      }
    })

  

module.exports = router