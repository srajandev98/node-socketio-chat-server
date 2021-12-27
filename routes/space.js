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
        const spaces = await spaceService.getSpace(req);
        if (spaces) {
            return res.status(200).json({
                data: spaces
            });
        } else {
            return res.status(404).json({
                error: 'No Spaces Found'
            });
        }
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

/**
 * @description GET /api/space/:spaceId
 */
router.get('/:spaceId', isAuth, async (req, res) => {
    try {
        const space = await spaceService.getSpaceBySpaceId(req);
        if (space) {
            return res.status(200).json({
                data: space
            });
        } else {
            return res.status(404).json({
                error: 'No Space Found'
            });
        }
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

/**
 * @description POST /api/space
 */
router.post('/', isAuth, async (req, res) => {
    try {
        const space = await spaceService(req);
        return res.status(200).json({
            data: space
        });
    } catch (e) {
        logger.error('error: %o', e);
        return next(e);
    }
});

/**
 * @description DELETE /api/space/:space_name
 */
// router.delete('/:space_name', isAuth, async (req, res) => {
//     try {
//         const space = await Space.findOneAndDelete({ name: req.params.space_name })
//             .populate('user', ['username'])
//             .select('-password')
//             .lean();

//         if (space) {
//             return res.status(200).json(space);
//         } else {
//             return res.status(404).json({
//                 errors: `No space with name ${req.params.space_name} found, You will now be redirected`
//             });
//         }
//     } catch (err) {
//         return res.status(404).json(err);
//     }
// });

/**
 * @description PUT /api/space/remove/users
 */
// router.post('/remove/users', isAuth, async (req, res) => {
//     const space = await Space.findOne({ name: req.body.space_name });

//     if (space) {
//         if (space.users.find(user => user.lookup.toString() === req.user.id)) {
//             space.users = space.users.filter(user => user.lookup.toString() !== req.user.id);
//             await space.save();
//         }
//         const returnSpace = await Space.populate(space, {
//             path: 'user users.lookup',
//             select: 'username social image handle'
//         });
//         return res.status(200).json(returnSpace);
//     } else {
//         return res.status(404).json({ errors: `No space with name ${req.params.space_name} found` });
//     }
// });

/**
 * @description PUT /api/space/remove/users/:id/all
 */
// router.put('/remove/users/all', isAuth, async (req, res) => {
//     await Space.updateMany({ $pull: { users: { $in: [req.body.user_id] } } });

//     const spaces = await Space.find({})
//         .populate('user', ['username'])
//         .populate('users.lookup', ['username'])
//         .select('-password')
//         .exec();

//     if (spaces) {
//         return res.status(200).json(spaces);
//     } else {
//         return res.status(404).json({ error: 'No Spaces Found' });
//     }
// });

module.exports = router;
