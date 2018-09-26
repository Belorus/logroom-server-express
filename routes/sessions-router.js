const express = require('express');
const sessionsMiddleware = require('../middlewares/sessions-middleware');
const router = express.Router();

router.get('/activeSessions', sessionsMiddleware.getActiveSessions);
router.get('/allSessions', sessionsMiddleware.getAllSessions);
router.get('/sessions/:sessionId', sessionsMiddleware.getSession);

module.exports = router;
