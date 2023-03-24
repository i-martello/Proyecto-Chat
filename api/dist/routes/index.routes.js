"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../controllers/index.controller");
const router = (0, express_1.Router)();
router.post('/registro', index_controller_1.ctrlIndex.addUser);
router.post('/login', index_controller_1.ctrlIndex.loginUser);
router.get('/validate', index_controller_1.ctrlIndex.validateUser);
exports.default = router;
