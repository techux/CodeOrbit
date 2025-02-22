const express = require('express');

const { lcQuestionController, gfgSubmissionController, code360Controller } = require("../controllers/stats.controller");


const router = express.Router();

router.get("/leetcode", lcQuestionController);
router.get("/gfg", gfgSubmissionController);
router.get("/code360", code360Controller);

module.exports = router;