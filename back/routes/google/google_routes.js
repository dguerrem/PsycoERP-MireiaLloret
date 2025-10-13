const express = require('express');
const router = express.Router();
const googleController = require('../../controllers/google/google_controller');
const { authenticateToken } = require('../../middlewares/auth');

// Public endpoint to generate an auth URL. NOTE: this is public by request; in
// production consider protecting this route to avoid abuse.
router.get('/auth-url', googleController.getAuthUrl);

// Public callback endpoint where Google will redirect with the code
router.get('/oauth2callback', googleController.oauth2callback);

module.exports = router;
