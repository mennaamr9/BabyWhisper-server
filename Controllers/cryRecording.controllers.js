const sequelize = require('../Config/db');
const express = require("express");
const CryRecording = require('../db/Models/cryRecordingModel');
const Baby = require('../db/Models/babyModel');
const User = require('../db/Models/userModel');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
// const ProgressStream = require('progress-stream');
// const { io, onlineUsers } = require('../sockets/socketManager'); // Adjust path as needed
// const jwt = require('jsonwebtoken');


//uploadRecords
const uploadRecords = async (req, res) => {
  try {
    console.log('Request received at:', new Date().toISOString());
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    console.log('User:', req.user);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    console.log('Uploaded File:', file);

    const userId = req.user?.user_id;
    const baby = await Baby.findOne({ where: { user_id: userId } });

    if (!baby) {
      return res.status(404).json({ message: 'No baby found for this user' });
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path));

    const response = await axios.post('http://127.0.0.1:5000/predict/', formData, {
      headers: formData.getHeaders(),
    });

    console.log('Raw Flask Response:', response.data);
    const { prediction, suggestion } = response.data;

    if (!prediction || !suggestion) {
      return res.status(400).json({
        message: 'Invalid response from Flask',
        data: response.data,
      });
    }

    const file_format = path.extname(file.originalname).substring(1);

    const newRecording = await CryRecording.create({
      file_path: file.path,
      file_format: file_format,
      baby_id: baby.baby_id,
      prediction: prediction,
      suggestion: suggestion,
    });

    console.log('Recording saved:', newRecording);

    res.status(200).json({
      message: 'Cry recording uploaded and saved',
      data: newRecording,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};


// const uploadRecords = async (req , res) => {
//     try {

//       console.log('Request received at:', new Date().toISOString());
//       console.log('Params:', req.params);
//       console.log('Body:', req.body);
//       console.log('User:', req.user); 


//         const file = req.file;

//         if (!file) {
//           return res.status(400).json({ message: 'No audio file provided' });
//         }

//         console.log('File:', req.file); 

//         const userId = req.user?.user_id; 

//         // Find the baby that belongs to the logged-in user
//         const baby = await Baby.findOne({
//           where: { user_id: userId }
//         });

//         if (!baby) {
//           return res.status(404).json({ message: 'No baby found for this user' });
//         }



//         const progress = ProgressStream({
//           length: file.size,
//           time: 100,
//         });

//         progress.on('progress', (progressData) => {
//           const userSocketId = onlineUsers.get(userId);
//           if (userSocketId) {
//             io.to(userSocketId).emit('upload-progress', {
//               percentage: Math.round(progressData.percentage)
//             });
//           }
//         });


//         const readStream = fs.createReadStream(file.path);
//         readStream.pipe(progress);

//         const formData = new FormData();
//         formData.append('file', progress, {
//           filename: file.originalname,
//           contentType: file.mimetype,
//         });


//         // Send file to Flask
//         const response = await axios.post('http://127.0.0.1:5000/predict/', formData, {
//           headers: {
//                 ...formData.getHeaders(), 
//           },
//           maxBodyLength: Infinity,
//           maxContentLength: Infinity,
//         });


//         const {prediction , suggestion } = response.data;
//         const file_format = path.extname(file.originalname).substring(1); 

//         console.log('Prediction from Flask:', prediction);
//         console.log('Flask response:', response.data);

//         // Save to MySQL
//         const newRecording = await CryRecording.create({
//            file_path: file.path,
//            file_format: file_format,
//            baby_id: baby.baby_id, 
//            prediction: prediction,
//            suggestion,
//         });

//         // console.log('Saved CryRecording:', newRecording?.toJSON?.());
//         console.log('Recording saved:', newRecording);


//         res.status(200).json({
//           message: 'Cry recording uploaded and saved',
//           data: newRecording
//         });
//       } catch (error) {
//         console.error('Upload Error:', error);
//         res.status(500).json({ message: 'Something went wrong', error: error.message });
//       }


// };

//getAllRecords
const getAllRecords = async (req, res) => {
  try {

    let Records = await CryRecording.findAll();

    res.status(200).json({ status: "success", data: { Records } });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

};

//getRecordsById
const getRecordsById = async (req, res) => {
  try {
    const recordingId = req.params.id;

    // console.log("Incoming recordingId:", recordingId); 

    // Validate the recordingId to ensure it's a number
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(recordingId)) {
      return res.status(400).json({ message: 'Invalid Record ID. Must be a number.' });
    }

    const id = parseInt(recordingId, 10);

    // Fetch record by primary key
    const Record = await CryRecording.findByPk(id);

    if (!Record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json(Record);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }

};

//getRecordsByBaby
const getRecordsByBaby = async (req, res) => {

  try {
    const { babyId } = req.params;

    if (!babyId || isNaN(parseInt(babyId, 10))) {
      return res.status(400).json({ message: 'Invalid or missing baby ID' });
    }

    const recordings = await CryRecording.findAll({
      where: { baby_id: parseInt(babyId, 10) }
    });

    res.status(200).json({ data: recordings });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

//deleteRecordsById
const deleteRecordsById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10); // Convert ID to number

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find the user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadRecords,
  getAllRecords,
  getRecordsById,
  getRecordsByBaby,
  deleteRecordsById,
}