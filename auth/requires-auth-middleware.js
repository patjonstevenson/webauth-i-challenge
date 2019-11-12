const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");

const requiresAuth = async (req, res, next) => {
    const { username, password } = req.headers;
    if (username && password) {
        try {
            const user = await Users.findBy({ username }).first();
            if (user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(400).json({ message: "Invalid credentials." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error authorizing." })
        }

    }
    else {
        res.status(400).json({ message: "Please provide credentials" });
    }
}

module.exports = requiresAuth;