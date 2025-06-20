// __tests__/controllers/resourceController.test.js
const { getAllResources , getResourceById  ,getResourcesByCategory } = require('../../Controllers/resources.controller');
const Resource = require('../../db/Models/resourceModel'); // Adjust path as needed

jest.mock('../../db/Models/resourceModel');

describe('getAllResources', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return all resources with status 200', async () => {
    const mockResources = [
      { id: 1, title: 'Resource 1' },
      { id: 2, title: 'Resource 2' }
    ];

    Resource.findAll.mockResolvedValue(mockResources);

    await getAllResources(req, res);

    expect(Resource.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { resources: mockResources }
    });
  });

  it('should handle server errors and return status 500', async () => {
    const error = new Error('Database failure');
    Resource.findAll.mockRejectedValue(error);

    await getAllResources(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  });

  it('returns 200 and the resource when found by ID', async () => {
    const req = { params: { id: '42' } };
    const res = {
       status: jest.fn().mockReturnThis(),
       json: jest.fn()
     };

     const fakeResource = { id: 42, title: 'Test Resource' };

     Resource.findByPk = jest.fn().mockResolvedValue(fakeResource); 

     await getResourceById(req, res); 

     expect(Resource.findByPk).toHaveBeenCalledWith('42'); // this should now work
     expect(res.status).toHaveBeenCalledWith(200);
     expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: fakeResource
    });
  });

  it('returns 404 when resource is not found by ID', async () => { 

    const req = { params: { id: '42' } };
    const res = {
       status: jest.fn().mockReturnThis(),
       json: jest.fn()
      };

     Resource.findByPk = jest.fn().mockResolvedValue(null); // simulate not found

     await getResourceById(req, res); // make the call

    expect(Resource.findByPk).toHaveBeenCalledWith('42'); // should pass
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Resource not found' });
  });


describe('getResourcesByCategory', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { category: 'education' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('returns 200 and resources if found', async () => {
    const mockResources = [{ id: 1, name: 'Book', category: 'education' }];

    Resource.findAll.mockResolvedValue(mockResources);

    await getResourcesByCategory(req, res);

    expect(Resource.findAll).toHaveBeenCalledWith({ where: { category: 'education' } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: mockResources });
  });

  it('returns 404 if no resources found', async () => {
    Resource.findAll.mockResolvedValue([]);

    await getResourcesByCategory(req, res);

    expect(Resource.findAll).toHaveBeenCalledWith({ where: { category: 'education' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No resources found for this category' });
  });

  it('returns 500 on error', async () => {
    Resource.findAll.mockRejectedValue(new Error('DB error'));

    await getResourcesByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error: 'DB error'
    });
  });
});


});
