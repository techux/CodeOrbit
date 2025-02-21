const User = require("../models/user.model");

const myProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password") ;
        res.status(200).json({
            status: "ok",
            data: user
        })
    } catch (error) {
        console.error(`Error in myProfileController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

const updateProfileController = async (req, res) => {
    try {
        const {name, username} = req.body;

        if (!name && !username) {
            return res.status(400).json({
                status: "error",
                message: "Please change some values to update"
            })
        }
        let query = {};
        if (name) query.name = name;
        if (username) query.username = username;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: query
            },
            {
                new: true
            }
        ).select("-password")

        return res.status(200).json({
            status: "ok",
            message: "Profile Updated Successfully",
            data: user
        })

    } catch (error) {
        console.error(`Error in updateProfileController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

const deleteAccountController = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id)
        res.cookie("token","",{maxAge:0})
        return res.status(200).json({
            status: "ok",
            message: "Account deleted successfully"
        })
    } catch (error) {
        console.error(`Error in deleteAccountController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const updatePlatformController = async (req, res) => {
    try {
        const { hackerrank, leetcode, gfg, codeforces, codechef, code360 } = req.body;
        if (!hackerrank && !leetcode && !gfg && !codeforces && !codechef && !code360){
            return res.status(400).json({
                status: "error",
                message: "Please select at least one platform to update"
            })
        }
        let query = {}
        if (hackerrank) query.hackerrank = hackerrank
        if (leetcode) query.leetcode = leetcode
        if (gfg) query.gfg = gfg
        if (codeforces) query.codeforces = codeforces
        if (codechef) query.codechef = codechef
        if (code360) query.code360 = code360
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: query
            },
            {
                new: true
            }
        ).select("-password")
        return res.status(200).json({
            status: "ok",
            message: "Platform Updated Successfully",
            data: user
        })
        
    } catch (error) {
        console.error(`Error in updatePlatformController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

const removePlatformController = async (req, res) => {
    try {
        const { platform } = req.body;
        if (!platform) {
            return res.status(400).json({
                status: "error",
                message: "Please select a platform to remove"
            })
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    [platform]: null
                }
            },
            {
                new: true
            }
        ).select("-password")
            
        return res.status(200).json({
            status: "ok",
            message: "Platform Removed Successfully",
            data: user
        })

    } catch (error) {
        console.error(`Error in removePlatformController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}
module.exports = {
    myProfileController,
    updateProfileController,
    deleteAccountController,
    updatePlatformController,
    removePlatformController
}