const express = require('express');
const logsMiddleware = require('../middlewares/logs-middleware');
const router = express.Router();

router.post('/push_logs', logsMiddleware.addNewLogsToSession);

module.exports = router;