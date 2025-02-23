const User = require("../models/user.model");
// const RefreshToken = require("../models/refreshtoken.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validate } = require("email-validator")

const loginController = async (req, res) => {
    try {
        const {email, username, password} = req.body ;
        if ((!email && !username) || !password){
            return res.status(400).json({
                status: "error",
                message: "Please enter all fields"
            })
        }
        if (!validate(email)){
            return res.status(400).json({
                status: "error",
                message: "Invalid email address"
            })
        }
        const user = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        });

        if (!user){
            return res.status(400).json({
                status: "error",
                message: "Invalid login credentials"
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            return res.status(400).json({
                status: "error",
                message: "Invalid login credentials"
            })
        }

        const accessToken = jwt.sign(
            { 
                id: user._id,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        )

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        )

        // await RefreshToken.create({
        //     token: refreshToken,
        //     userId: user._id,
        //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
        // });


        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
            path: '/',
        });

        return res.status(200).json({
            status:"ok", 
            message:"Logged in Successfully", 
            accessToken,
            // refreshToken
        })
    } catch (error) {
        console.error(`Error on loginController ${error.stack || error.message}`)
        res.status(500).json({
            status:"error",
            message: "Internal Server Error"
        });
    }
}


const registerController = async (req, res) => {
    try {
        const {name, email, username, password} = req.body ;
        if (!name || !email || !username || !password) {
            return res.status(400).json({
                status:"error",
                message: "Please fill all the fields"
            })
        }

        if (!validate(email)){
            return res.status(400).json({
                status: "error",
                message: "Invalid email address"
            })
        }

        const existUser = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        });

        if (existUser){
            if (existUser.email) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exists"
                })
            }
            if (existUser.username) {
                return res.status(400).json({
                    status: "error",
                    message: "Username already exists"
                })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10) ;

        const result = await User.create({name, email, username, password:hashedPassword}) ;

        return res.status(201).json({
            status: "ok",
            message: "User registered successfull, You may login now",
            userId: result._id
        })
        
    }
    catch (error) {
        console.error(`Error in registerController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const changePasswordController = async (req, res) => {
    try {
        const {newPassword, oldPassword} = req.body ;
        if (!newPassword || !oldPassword){
            return res.status(400).json({
                status:"error",
                message: "Please fill all the fields"
            })
        }

        const user = await User.findById(req.user.id) ;

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password) ;

        if (!isOldPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Old password didn't match. Please recheck the password"
            })
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(
            req.user.id,
            {
                password: newHashedPassword
            }
        )

        return res.status(200).json({
            status: "ok",
            message: "Password Changed Successfully"
        })

    } catch (error) {
        console.error(`Error in changePasswordController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const logoutController = async (req, res) => {
    try {
        res.cookie('token', '', {
            maxAge: 0, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        
        res.cookie('refreshToken', '', {
            maxAge: 0,  
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            path: '/' 
        });

        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
            return res.status(200).json({
                status: "ok",
                message: "Logged out successfully"
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Action Failed! Please try again"
            });
        }
    } catch (error) {
        console.error(`Error in logoutController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};


const checkAuthController = async (req, res) => {
    try {
        return res.status(200).json({
            status: "ok",
            data: req.user
        })
    } catch (error) {
        console.error(`Error in authCheckController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).json({
                status: "error",
                message: "Refresh token is required"
            });
        }

        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "Invalid or expired refresh token"
                });
            }

            const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken });
            if (!existingRefreshToken) {
                return res.status(401).json({
                    status: "error",
                    message: "Refresh token does not exist in the database"
                });
            }

            const userId = decoded.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    message: "User not found"
                });
            }

            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            const newRefreshToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '7d' } 
            );

            await RefreshToken.findOneAndUpdate(
                { token: refreshToken },
                { token: newRefreshToken },
                { upsert: true } 
            );

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
                path: '/'
            });

            return res.status(200).json({
                status: "ok",
                accessToken
            });
        });

    } catch (error) {
        console.error(`Error in refreshTokenController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};


module.exports = {
    loginController,
    registerController,
    changePasswordController,
    logoutController,
    checkAuthController
}