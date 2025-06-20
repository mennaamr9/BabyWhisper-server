class CryRecordingDTO {
  constructor(recording) {
    if (!recording) throw new Error('Cry recording entity is required.');
    this.recording_id = recording.recording_id;
    this.file_path = recording.file_path;
    this.duration = recording.duration;
    this.file_format = recording.file_format;
    this.baby_id = recording.baby_id;
  }
}

module.exports = CryRecordingDTO;
