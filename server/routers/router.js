import { Router } from "express";
import { getMessages, sendMessage } from "../controller/userController.js";

const router = Router();


router.post('/send',sendMessage);
router.get('/messages', getMessages); 


export default router;