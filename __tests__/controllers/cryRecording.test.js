
jest.mock('../../db/Models/cryRecordingModel', () => ({
  CryRecording: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  }
}));

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const { uploadRecords, getAllRecords , getRecordsById , getRecordsByBaby } = require('../../Controllers/cryRecording.controllers');
const  Baby  = require('../../db/Models/babyModel');
const  CryRecording = require('../../db/Models/cryRecordingModel');

jest.mock('axios');
jest.mock('fs');
jest.mock('form-data');



describe('uploadRecords controller', () => {
  let req, res, fakeBaby, fakeCryRecording, fakeFastApiResponse, mockFormData;

  beforeEach(() => {
    req = {
      user: { user_id: 'user123' },
      file: {
        path: '/fake/path/audio.mp3',
        originalname: 'audio.mp3'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();

    fakeBaby = { baby_id: 'baby123' };
    fakeCryRecording = {
      file_path: '/fake/path/audio.mp3',
      file_format: 'mp3',
      baby_id: 'baby123',
      prediction: 'Hungry',
      suggestion: 'Feed the baby'
    };

    fakeFastApiResponse = {
      data: {
        prediction: 'Hungry',
        suggestion: 'Feed the baby'
      }
    };

    // Mock FormData
    mockFormData = {
      append: jest.fn(),
      getHeaders: jest.fn().mockReturnValue({ 'content-type': 'multipart/form-data' })
    };
    require('form-data').mockImplementation(() => mockFormData);

    // Mock fs
    const fs = require('fs');
    fs.createReadStream.mockReturnValue('mocked stream');

    // Mock DB and axios
    Baby.findOne = jest.fn().mockResolvedValue(fakeBaby);
    CryRecording.create = jest.fn().mockResolvedValue(fakeCryRecording);
    axios.post.mockResolvedValue(fakeFastApiResponse);
  });
  

  it('should upload and save cry recording successfully', async () => {
    const fakeBaby = { baby_id: 'baby001' };
    const fakeFastApiResponse = {
      data: {
        prediction: 'Hungry',
        suggestion: 'Feed the baby'
      }
    };
    const fakeCryRecording = {
      id: 1,
      file_path: '/fake/path/audio.mp3',
      prediction: 'Hungry'
    };

    Baby.findOne.mockResolvedValue(fakeBaby);
    axios.post.mockResolvedValue(fakeFastApiResponse);
    CryRecording.create.mockResolvedValue(fakeCryRecording);

    await uploadRecords(req, res);

    expect(Baby.findOne).toHaveBeenCalledWith({ where: { user_id: 'user123' } });
    expect(fs.createReadStream).toHaveBeenCalledWith('/fake/path/audio.mp3');
    expect(mockFormData.append).toHaveBeenCalledWith('file', 'mocked stream');
    expect(axios.post).toHaveBeenCalled();
    expect(CryRecording.create).toHaveBeenCalledWith({
      file_path: '/fake/path/audio.mp3',
      file_format: 'mp3',
      baby_id: 'baby001',
      prediction: 'Hungry',
      suggestion: 'Feed the baby'
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Cry recording uploaded and saved',
      data: fakeCryRecording
    });
  });

  it('should return 400 if no file is provided', async () => {
    req.file = null;

    await uploadRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No audio file provided' });
  });

  it('should return 404 if no baby found', async () => {
    Baby.findOne.mockResolvedValue(null);

    await uploadRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No baby found for this user' });
  });

  it('should return 500 if an error occurs', async () => {
    Baby.findOne.mockRejectedValue(new Error('DB error'));

    await uploadRecords(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
      error: 'DB error'
    });
  });
});

