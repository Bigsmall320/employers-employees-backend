const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    //check for duplicate usernames in the db
    // const duplicate = usersDB.users.find(person => person.username === user);
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 
    try {
        //hash the password with salt
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //assign admin to first user
        const isFirstUser = (await User.countDocuments({})) === 0;
        const roles = isFirstUser ? { User: 2001, Admin: 5150 } : { User: 2001 };

        //store the new user
        // const newUser = {
        //     "username": user, 
        //     "roles": {"user": 2001}, 
        //     "password": hashedPwd 
        // };

        //create and store the new user
        const result = await User.create({
            "username": user, 
            "password": hashedPwd, 
            "roles": roles
        });

        console.log(result);

        // usersDB.setUsers([...usersDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        // console.log(usersDB.users);
        res.status(201).json({ 'success': `New user ${user} created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}        

module.exports = { handleNewUser };