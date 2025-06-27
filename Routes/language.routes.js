const express = require("express");
const router = express.Router();
const languageController = require("../Controllers/language.controller")

router.post("/translate",  languageController.translate)

module.exports = router;
