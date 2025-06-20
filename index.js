const express = require('express');
require("dotenv").config();
const cors = require("cors");
const path = require('path');
const multer = require('multer');
const { sequelize } = require('./Config/db');
const http = require('http');
const authRouter = require('./Routes/auth.routes');
const userRouter = require('./Routes/user.routes');
const resourceRouter = require('./Routes/resources.routes');
const scheduleRouter = require('./Routes/schedules.routes');
const notificationRouter = require('./Routes/notification.routes');
const cryRecordsRouter = require('./Routes/cryRecording.routes');
const chatbotRouter = require('./Routes/chatbot.routes');
const tutorialsRouter = require('./Routes/tutorial.routes');
const authMiddleware = require('./middlewares/authMiddleware');
const User = require('./db/Models/userModel');
const Baby = require('./db/Models/babyModel');
const Resource = require('./db/Models/resourceModel');
const schedule_entries = require('./db/Models/scheduleEntryModel');
const doses = require('./db/Models/doseModel');
const Vaccine = require('./db/Models/vaccineModel');
const CryRecording = require('./db/Models/cryRecordingModel');
const Notification = require('./db/Models/notificationModel');
const setupAssociations = require('./db/Models/associations');
const app = express();


//Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRouter);  // api/user/
app.use('/api/user', userRouter);  // api/user/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/resource', resourceRouter);  // api/resource/
app.use('/api/schedule', scheduleRouter);  // api/schedule/
app.use('/api/notification', notificationRouter);  // api/notification/
app.use('/api/records', authMiddleware, cryRecordsRouter);  // api/records/
app.use('/api/chat', chatbotRouter);  // api/chat/

app.use('/api/tutorials', tutorialsRouter);


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
  next();
});


// Test DB Connection
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    setupAssociations();

    await sequelize.sync({ alter: true });
    console.log('All models synchronized');

  } catch (error) {
    console.error(' Database connection failed:', error);
  }
};

startServer();

// const { initializeSocket } = require("./sockets/socketManager");
const server = http.createServer(app);

// Initialize Socket.io
// initializeSocket(server);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});




