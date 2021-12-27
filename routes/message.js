const express = require('express');
const router = express.Router();

const { logger } = require('../config/logModule');

const _MessageService = require('../services/message.service');
const messageService = new _MessageService();

const isAuth = require('../middleware/isAuth');

/**
 * @description GET /api/messages/:spaceId
 */
router.get('/:spaceId', isAuth, async (req, res) => {
    logger.debug('Calling Get Messages by spaceId endpoint with params: %o', req.params);
    try {
        const messages = await messageService.getMessagesBySpaceId(req);
        return res.json({ data: messages }).status(200);
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

/**
 * @description POST /api/messages/
 */
router.post('/', isAuth, async (req, res) => {
    logger.debug('Calling Create Message endpoint with body: %o', req.body);
    try {
        const message = await messageService(req);
        return res.status(200).json({ data: message });
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

module.exports = router;
