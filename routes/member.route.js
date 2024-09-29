const express = require('express');
const { getMembers, getSingleMember, updateMember, deleteMember, changeStatus, acceptIn } = require('../controllers/member.controller');
const verifyModerator = require('../utils/verifyModerator');
const verifyMember = require('../utils/verifyMember');
const { updateMemberMiddleware } = require('../middlewares/member.middleware');
let memberRoute = express.Router();

memberRoute.route("/")
            .get(verifyModerator, getMembers)
            .delete(verifyMember , deleteMember)





            memberRoute.route("/acceptIn/:memberId/")
                        .patch(verifyModerator,acceptIn)

memberRoute.route("/:memberId")
            .get(getSingleMember)
            .put(verifyMember,updateMemberMiddleware,updateMember)

memberRoute.route("/:memberId/:statusId")
            .patch(verifyModerator,changeStatus)


module.exports = memberRoute