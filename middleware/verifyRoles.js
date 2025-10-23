const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req?.roles) {
            console.log('No roles found on request object');
            return res.sendStatus(401);
        }

        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) {
            console.log('Role not authorized');
            return res.sendStatus(401);
        }
        next();
    }
}

module.exports = verifyRoles;