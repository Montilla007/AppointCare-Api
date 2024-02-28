const express = require('express');
const router = express.Router();
const { deleteDoctor, verifyDoctor, acceptDoctor, rejectDoctor, pendingDoctor  } = require('../controllers/panel');


router.get('/accepted', acceptDoctor);
router.get('/rejected', rejectDoctor);
router.get('/pending', pendingDoctor);
router.put('/verify/:id', verifyDoctor);
router.delete('/delete/:id', deleteDoctor);


router.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
  });
  
module.exports = router;
