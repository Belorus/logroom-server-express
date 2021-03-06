const express = require('express');
const logsMiddleware = require('../middlewares/logs-middleware');
const router = express.Router();

router.get('/sessionLogs', logsMiddleware.getSessionLogs);
router.get('/sessionLogsFileLink', logsMiddleware.getSessionLogsFileLink);
router.post('/push_logs', logsMiddleware.addSessionLogsAndUpdateInfo);

module.exports = router;