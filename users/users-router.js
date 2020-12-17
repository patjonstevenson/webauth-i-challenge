const router = require('express').Router();

const requiresAuth = require("../auth/requires-auth-middleware");

const Users = require('./users-model');

router.get("/", requiresAuth, async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching users:\n", error);
        res.status(500).json("Internal server error");
    }
});

module.exports = router;