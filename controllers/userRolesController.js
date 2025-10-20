const ROLES_LIST = require('../../config/role_list');
const User = require('../model/User');

const addRoles = async (username, roleName) => {
    const user = await User.findOne({ username });
    if (!user) {
        console.log('User not found.');
        return;
    }

    user.roles = user.roles || {};

    if (!user.roles[roleName]) {
        user.roles[roleName] = ROLES_LIST[roleName];
        await user.save();
        console.log(`${roleName} role added to  ${username}`);
    } else { 
        console.log(`${username} alreay has the ${roleName}`);
    }
}

const removeRoles = async (username) => {
    const user = await User.findOnde({ username });

    if (!user.roles.User) {
        user.roles.User = ROLES_LIST.User;
        await user.save();
        console.log('User role added.');
    } else {
        console.log('User already has the User role.');
    }
}

module.exports = {
    addRoles,
    removeRoles
}