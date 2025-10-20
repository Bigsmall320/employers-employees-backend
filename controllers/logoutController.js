const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout =  async (req, res) => {
    //on client also delete the access token
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //successful but no content
    const refreshToken = cookies.jwt;

    //is refresh token in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    //delete refresh token in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);

    //save user data to db
    //TODO: implement databese
    try {
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
    } catch (error) {
        console.error('Error is saving user data:', error);
        return res.sendStatus(500).send('Internal server error');
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };