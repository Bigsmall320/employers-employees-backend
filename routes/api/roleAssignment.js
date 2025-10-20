const express = require('express');
const router = express.Router();
const userRolesController = require('../../controllers/userRolesController');
const ROLES_LIST = require('../../config/role_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), userRolesController.addRoles)
    .delete(verifyRoles(ROLES_LIST.Admin) ,userRolesController.removeRoles);   

module.exports = router;