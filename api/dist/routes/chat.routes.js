"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const router = (0, express_1.Router)();
router.route('/chat')
    .post(chat_controller_1.ctrlChat.postMsg)
    .get((req, res) => req.body);
exports.default = router;
