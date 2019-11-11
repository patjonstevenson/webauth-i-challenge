const router = require('express').Router();
const bcrypt = require("bcryptjs");

const Users = require('../users/users-model');

router.post("/register", async (req, res) => {
    const credentials = {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 14)
    };

    try {
        const saved = await Users.add(credentials);
        res.status(201).json(saved);
    } catch (error) {
        console.log("Error registering:\n", error);
        res.status(500).json({ message: "Internal server error" })
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        try {
            const user = await Users.findBy({ username }).first();
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome to the site, ${user.username}` });
            } else {
                res.status(401).json({ message: "Invalid credentials." });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error logging in." })
        }
    }
});

module.exports = router;