const User = require("../models/user.model");
const { leetcode, gfg, code360 } = require("../utils/getData");

const leetcodeController = async (req, res) => {
    try {
        const username = (await User.findById(req.user.id).select("leetcode")).leetcode;
        if (!username){
            return res.status(404).json({
                status: "error",
                message: "Please set the Leetcode username first"
            });
        }
        const data = await leetcode(username);
        return res.status(200).json({
            status: "ok",
            data: data
        })
    } catch (error) {
        console.error(`Error in leetcodeController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const gfgController = async (req, res) => {
    try {
        const username = (await User.findById(req.user.id).select("gfg")).gfg;
        if (!username){
            return res.status(404).json({
                status: "error",
                message: "Please set the GeeksForGeeks username first"
            });
        }
        const data = await gfg(username);
        return res.status(200).json({
            status: "ok",
            data: data
        })
    } catch (error) {
        console.error(`Error in gfgController : ${error.stack || error.message}`);
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
        const data = await code360(username);
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
    leetcodeController,
    gfgController,
    code360Controller
}