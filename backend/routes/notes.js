const express = require('express');
const { body, validationResult } = require('express-validator')
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const JWT_SECRET = 'anasisagoodb$oy'; // This should be the same everywhere


//Router 1: get all notes of user using : Get "/api/notes/fetchallnotes". login require
router.get('/fetchallnotes', fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('INTERNAL SERVER ERROR');
  }
})

//Router 2: Add a new note using : Post "/api/notes/addnote". login require
router.post('/addnote', fetchUser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'description should be at least 5 characters').isLength({ min: 5 })],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

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

//Router 3: Update a note using id : Put "/api/notes/updatenotenote". login require
//':id' is id of note that will be updated
router.put('/updatenote/:id', fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // Create a new note object
    const newNote = {};
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }

    // Find the note to be updated
    let note = await Notes.findById(req.params.id);  // Use `await` to ensure we get the note

    // If note doesn't exist
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // Ensure the user requesting the update is the owner of the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // Update the note and return the updated note if user own the note
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


//Router 4: Delete a note using id : Delete "/api/notes/deletenote". login require
//':id' is id of note that will be deleted
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Find the note to be updated
    let note = await Notes.findById(req.params.id);  // Use `await` to ensure we get the note
    // If note doesn't exist
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // Ensure the user requesting the update is the owner of the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    // Update the note and return the delete note if user own the note
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note hase been deleted!", note:note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router