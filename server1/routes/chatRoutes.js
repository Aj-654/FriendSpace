import express from "express";
/*const {
  accessChat,
  fetchChats,
  createGroupChat,
  groupExit,
  fetchGroups,
} = require("../controllers/chatControllers");*/

import { accessChat, fetchChats, createGroupChat, groupExit, fetchGroups } from "../controllers/chatControllers.js";
//const { protect } = require("../middleware/authMiddleware");
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);
router.route("/createGroup").post(verifyToken, createGroupChat);
router.route("/fetchGroups").get(verifyToken, fetchGroups);
router.route("/groupExit").put(verifyToken, groupExit);

export default router;
