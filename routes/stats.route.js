const express = require('express');

const { leetcodeController, gfgController, code360Controller } = require("../controllers/stats.controller");


const router = express.Router();

router.get("/leetcode", leetcodeController);
router.get("/gfg", gfgController);
router.get("/code360", code360Controller);

module.exports = router;