import express from "express";
/*const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");*/
import { allMessages, sendMessage } from "../controllers/messageControllers.js";
//const { protect } = require("../middleware/authMiddleware");
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);

export default router;
