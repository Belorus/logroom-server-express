const express = require('express');
const markersMiddleware = require('../middlewares/markers-middleware');
const router = express.Router();

router.get('/sessions/:sessionId/markers', markersMiddleware.getSessionMarkers);
router.post('/sessions/:sessionId/markers', markersMiddleware.addSessionMarker);
router.delete('/sessions/:sessionId/markers', markersMiddleware.deleteSessionMarker);

module.exports = router;
