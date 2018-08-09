const express = require('express');
const sessionsMiddleware = require('../middlewares/sessions-middleware');
const router = express.Router();

router.get('/activeSessions', sessionsMiddleware.getActiveSessions);
router.get('/sessions', sessionsMiddleware.getAllSessions);

module.exports = router;
