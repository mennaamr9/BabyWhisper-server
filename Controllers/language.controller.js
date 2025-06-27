// const sequelize = require('../Config/db');
const express = require("express");
const axios = require("axios");

const translate = async (req, res)=>{
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ message: "Text and targetLang are required" });
    }
  
    try {
      const response = await axios.post("https://translate.argosopentech.com/translate", {
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
    },{
            headers: {
              'Content-Type': 'application/json'
            }
      });

      console.log("LibreTranslate response:", response.data);

  
      res.status(200).json({ translated: response.data.translatedText});
    } catch (error) {
      console.error("LibreTranslate error:", error.message);
      console.error("Detailed Error:", error.response?.data || error);
      res.status(500).json({ message: "Translation failed" });
    }
}

module.exports = {translate}