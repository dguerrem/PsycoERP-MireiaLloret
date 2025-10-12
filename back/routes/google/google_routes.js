const express = require('express');
const router = express.Router();
const googleController = require('../../controllers/google/google_controller');
const { authenticateToken } = require('../../middlewares/auth');

// Protected endpoint to generate an auth URL for the logged-in user (psychologist)
router.get('/auth-url', authenticateToken, googleController.getAuthUrl);

// Public callback endpoint where Google will redirect with the code
router.get('/oauth2callback', googleController.oauth2callback);

module.exports = router;
