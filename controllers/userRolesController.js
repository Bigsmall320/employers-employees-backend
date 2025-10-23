const ROLES_LIST = require('../config/role_list');
const User = require('../model/User');

const addRoles = async (req, res) => {
  const { username, roleName } = req.body;

  if (!username || !roleName) {
    return res.status(400).json({ message: 'Username and roleName are required' });
  }

  if (!['Admin', 'Editor'].includes(roleName)) {
    return res.status(400).json({ message: 'Invalid role. Only Admin or Editor roles can be added.' });
  } //TODO: front end be structured to prevent this

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure roles object exists
    user.roles = user.roles || {};

    // If role already exists, skip adding
    if (user.roles[roleName]) {
      return res.status(201).json({ message: `${username} already has the ${roleName} role.` });
    }

    // Add the new role
    user.roles[roleName] = ROLES_LIST[roleName];
    await user.save();

    return res.status(201).json({ message: `${roleName} role successfully added to ${username}.` });

  } catch (error) {
    console.error('Error adding role:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

const removeRoles = async (req, res) => {
    const { username, roleName } = req.body;
    
    if (!username || !roleName) {
      return res.status(400).json({ message: 'Username and roleName are required' });
    }
    if (!['Admin', 'Editor'].includes(roleName)) {
      return res.status(400).json({ message: 'Invalid role. Only Admin or Editor roles can be removed.' });
    }
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // If role does not exist, skip removing
      if (!user.roles || !user.roles[roleName]) {
        return res.status(201).json({ message: `${username} does not have the ${roleName} role.` });
      }
      // Remove the role
      delete user.roles[roleName];
      user.markModified('roles');
      await user.save();

      const updatedUser = await User.findById(user._id);
      console.log("Roles in DB:", updatedUser.roles);
      return res.status(201).json({ message: `${roleName} role successfully removed from ${username}.` });
    } catch (error) {
      console.error('Error removing role:', error);
      return res.status(500).json({ message: 'Server error' });
    }

}

module.exports = {
    addRoles,
    removeRoles
}