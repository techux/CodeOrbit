const express = require('express');
const {
    myProfileController, 
    updateProfileController, 
    deleteAccountController, 
    updatePlatformController, 
    removePlatformController,
    getUsernameController } = require("../controllers/account.controller");

const router = express.Router();

router.get("/profile", myProfileController);
router.get("/username", getUsernameController);
router.patch("/update", updateProfileController);
router.post("/platform", updatePlatformController);
router.post("/platform/remove", removePlatformController);
router.delete("/", deleteAccountController);


module.exports = router;