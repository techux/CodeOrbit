const User = require("../models/user.model");

const leetcode = require("../services/leetcode.service");
const gfg = require("../services/gfg.service");
const code360 = require("../services/code360.service");

// leetcode question submission stats
const lcQuestionController = async (req, res) => {
    try {
        const username = (await User.findById(req.user.id).select("leetcode")).leetcode;
        if (!username){
            return res.status(404).json({
                status: "error",
                message: "Please set the Leetcode username first"
            });
        }
        const data = await leetcode.questions(username);
        return res.status(200).json({
            status: "ok",
            data: data
        })
    } catch (error) {
        console.error(`Error in lcQuestionController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// geeksforgeeks submissions only
const gfgSubmissionController = async (req, res) => {
    try {
        const username = (await User.findById(req.user.id).select("gfg")).gfg;
        if (!username){
            return res.status(404).json({
                status: "error",
                message: "Please set the GeeksForGeeks username first"
            });
        }
        const data = await gfg.submissions(username);
        return res.status(200).json({
            status: "ok",
            data: data
        })
    } catch (error) {
        console.error(`Error in gfgSubmissionController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const code360Controller = async (req, res) => {
    try {
        const username = (await User.findById(req.user.id).select("code360")).code360;        
        if (!username){
            return res.status(404).json({
                status: "error",
                message: "Please set the Naukri Code360 username first"
            });
        }
        const data = await code360.questions(username);
        return res.status(200).json({
            status: "ok",
            data: data
        })
    } catch (error) {
        console.error(`Error in code360Controller : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

module.exports = {
    lcQuestionController,
    gfgSubmissionController,
    code360Controller
}