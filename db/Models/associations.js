const  User = require('./userModel');
const  Baby  = require('./babyModel');
const Resource  = require('./resourceModel');
const doses  = require('./doseModel');
const schedule_entries  = require('./scheduleEntryModel');
const Vaccine  = require('./vaccineModel');
const CryRecording  = require('./cryRecordingModel');
const Notification  = require('./notificationModel');

const setupAssociations = () => {
  // User - Baby
  User.hasMany(Baby, { foreignKey: 'user_id', as: "babies", onDelete: "CASCADE" });
  Baby.belongsTo(User, { foreignKey: 'user_id', as: "user" });

  // User - Resource
  User.hasMany(Resource, { foreignKey: "user_id", as: "resource", onDelete: "CASCADE" });
  Resource.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // Doses - Schedule_Entries
  doses.hasMany(schedule_entries, { foreignKey: "dose_id", as: "schedule_entries", onDelete: "CASCADE" });
  schedule_entries.belongsTo(doses, { foreignKey: "dose_id", as: "doses" });

  // Vaccine - Schedule_Entries
  Vaccine.hasMany(schedule_entries, { foreignKey: "vaccine_id", as: "schedule_entries", onDelete: "CASCADE" });
  schedule_entries.belongsTo(Vaccine, { foreignKey: "vaccine_id", as: "vaccine" });

  // Baby - CryRecording
  Baby.hasMany(CryRecording, { foreignKey: 'baby_id', as: 'recordings' });
  CryRecording.belongsTo(Baby, { foreignKey: 'baby_id', as: 'baby' });

  // User - Notification
  User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'user_id' });
};

module.exports = setupAssociations;
