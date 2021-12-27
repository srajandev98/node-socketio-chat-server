const express = require('express');
const router = express.Router();

const { logger } = require('../config/logModule');

const _SpaceService = require('../services/space.service');
const spaceService = new _SpaceService();

const isAuth = require('../middleware/isAuth');

/**
 * @description GET /api/space
 */
router.get('/', isAuth, async (req, res) => {
    try {
        return;
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
    const spaces = await Room.find({})
        .populate('user', ['handle'])
        .populate('users.lookup', ['handle'])
        .select('-password')
        .exec();

    if (spaces) {
        return res.status(200).json(rooms);
    } else {
        return res.status(404).json({ error: 'No Rooms Found' });
    }
});

/**
 * @description GET /api/space/:room_id
 */
router.get('/:roomId', isAuth, async (req, res) => {
    try {
        return;
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
    const room = await Room.findById(req.params.room_id)
        .populate('user', ['username', 'social', 'image', 'handle'])
        .populate('users.lookup', ['username', 'social', 'image', 'handle'])
        .exec();

    if (room) {
        return res.status(200).json(room);
    } else {
        return res.status(404).json({ error: `No room with name ${req.params.room_name} found` });
    }
});

/**
 * @description POST /api/space
 */
router.post('/', isAuth, async (req, res) => {
    try {
        const space = await spaceService(req);
        return res.status(200).json({ data: space });
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

/**
 * @description DELETE /api/room/:room_name
 */
// router.delete('/:room_name', isAuth, async (req, res) => {
//     try {
//         const room = await Room.findOneAndDelete({ name: req.params.room_name })
//             .populate('user', ['username'])
//             .select('-password')
//             .lean();

//         if (room) {
//             return res.status(200).json(room);
//         } else {
//             return res.status(404).json({
//                 errors: `No room with name ${req.params.room_name} found, You will now be redirected`
//             });
//         }
//     } catch (err) {
//         return res.status(404).json(err);
//     }
// });

/**
 * @description PUT /api/room/remove/users
 */
// router.post('/remove/users', isAuth, async (req, res) => {
//     const room = await Room.findOne({ name: req.body.room_name });

//     if (room) {
//         if (room.users.find(user => user.lookup.toString() === req.user.id)) {
//             room.users = room.users.filter(user => user.lookup.toString() !== req.user.id);
//             await room.save();
//         }
//         const returnRoom = await Room.populate(room, {
//             path: 'user users.lookup',
//             select: 'username social image handle'
//         });
//         return res.status(200).json(returnRoom);
//     } else {
//         return res.status(404).json({ errors: `No room with name ${req.params.room_name} found` });
//     }
// });

/**
 * @description PUT /api/room/remove/users/:id/all
 */
// router.put('/remove/users/all', isAuth, async (req, res) => {
//     await Room.updateMany({ $pull: { users: { $in: [req.body.user_id] } } });

//     const rooms = await Room.find({})
//         .populate('user', ['username'])
//         .populate('users.lookup', ['username'])
//         .select('-password')
//         .exec();

//     if (rooms) {
//         return res.status(200).json(rooms);
//     } else {
//         return res.status(404).json({ error: 'No Rooms Found' });
//     }
// });

module.exports = router;
