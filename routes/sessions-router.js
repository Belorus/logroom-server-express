const express = require('express');
const sessionsMiddleware = require('../middlewares/sessions-middleware');
const router = express.Router();

router.get('/activeSessions', sessionsMiddleware.getActiveSessions);

module.exports = router;
