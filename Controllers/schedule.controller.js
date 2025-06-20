const sequelize = require('../Config/db');
const express = require("express");
const Schedula =require('../db/Models/scheduleEntryModel');



//getAllSchedules
const getAllSchedules = async (req , res) => {
    try {
        
        let schedules = await Schedula.findAll({
            include:['doses' , 'vaccine']
        });
        
        res.status(200).json({ status: "success", data: { schedules } });
      } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    
};


//getSchedulesByAge
const getSchedulesByAge = async (req , res) => {

  const { age_group } = req.params;

  try {
      
      let schedules = await Schedula.findAll({
          where:{age_group},
          include:['doses' , 'vaccine']
      });

      if (schedules.length === 0) {
        return res.status(404).json({ message: 'No schedule found for this age group.' });
      }
      
      res.status(200).json({ status: "success", data: { schedules } });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  
};



module.exports = {
    getAllSchedules,
    getSchedulesByAge
}