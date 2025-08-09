import { Router } from "express";
import { getMessages, sendMessage } from "../controller/userController.js";

const router = Router();

router.post('/send', sendMessage); // Endpoint to send a new message
router.get('/messages', getMessages); // Endpoint to fetch messages

export default router;
