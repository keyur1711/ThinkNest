const express = require('express');
const router = express.Router();
const { subscribeUser, getAllSubscribers, deleteSubscriber } = require('../controllers/subscribeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', subscribeUser);
router.get('/', authMiddleware, getAllSubscribers);
router.delete('/:id', authMiddleware, deleteSubscriber);

module.exports = router;
