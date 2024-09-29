const express = require('express');
const { getModerators, createModerator, getSingleModerator, updateModerator, deleteModerator, loginModerator, logoutModerator, changeActiveState } = require('../controllers/moderator.controller');
const { createModeratorMiddleware, loginModeratorMiddleware, updateModeratorMiddleware } = require('../middlewares/moderator.middleware');
const verifyModerator = require('../utils/verifyModerator');

const moderatorRoute = express.Router();

moderatorRoute.route("/")
            .get(verifyModerator , getModerators)
            .post(verifyModerator ,createModeratorMiddleware,createModerator)
            .patch(verifyModerator ,updateModeratorMiddleware ,updateModerator)


moderatorRoute.route("/login")
            .post(loginModeratorMiddleware,loginModerator)


moderatorRoute.route("/logout")
            .post(verifyModerator,logoutModerator)


moderatorRoute.route("/:moderatorId")
            .get(verifyModerator , getSingleModerator)
            .delete(verifyModerator ,deleteModerator)
            .patch(verifyModerator ,changeActiveState)




module.exports = moderatorRoute