const express = require('express');
const {
    myProfileController, 
    updateProfileController, 
    deleteAccountController, 
    updatePlatformController, 
    removePlatformController } = require("../controllers/account.controller");

const router = express.Router();

router.get("/profile", myProfileController);
router.patch("/update", updateProfileController);
router.post("/platform", updatePlatformController);
router.post("/platform/remove", removePlatformController);
router.delete("/", deleteAccountController);


module.exports = router;