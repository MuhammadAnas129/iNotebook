const express = require('express');
const { body, validationResult } = require('express-validator')
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const JWT_SECRET = 'anasisagoodb$oy'; // This should be the same everywhere


//Router 1: get all notes of user using : Get "/api/notes/fetchallnotes". login require
router.get('/fetchallnotes',fetchUser, async (req,res)=>{
    try {
    const notes = await Notes.find({user: req.user.id});
    res.json(notes);
} catch (error) {
    console.error(error.message);
    res.status(500).send('INTERNAL SERVER ERROR');
  }
})

//Router 2: Add a new note using : Post "/api/notes/addnote". login require
router.get('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description should be at least 5 characters').isLength({ min: 5 })],
    async (req,res)=>{
        try {
        const{title, description,tag} = req.body;

    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Notes({
        title, description, tag, user: req.user.id
    });

    const saveNote = await note.save();
    res.json(saveNote)
} catch (error) {
    console.error(error.message);
    res.status(500).send('INTERNAL SERVER ERROR');
  }
})

module.exports = router