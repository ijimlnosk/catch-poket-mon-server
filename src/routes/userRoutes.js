const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);
router.post("/sign-out", userController.signOut);
router.get("/refresh", userController.refreshToken);
router.patch(
    "/update/profileUrl",
    auth,
    upload.single("image"),
    userController.updateProfileUrl
);
router.patch("/update/info", auth, userController.updateInfo);

module.exports = router;
