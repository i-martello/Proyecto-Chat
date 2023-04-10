"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true, versionKey: false });
exports.default = (0, mongoose_1.model)('chat', chatSchema);
