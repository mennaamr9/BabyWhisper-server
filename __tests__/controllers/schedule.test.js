const { getAllSchedules , getSchedulesByAge} = require('../../Controllers/schedule.controller');
const Schedula = require('../../db/Models/scheduleEntryModel');

jest.mock('../../db/Models/scheduleEntryModel');

describe('getAllSchedules', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('returns 200 and all schedules with includes', async () => {
    const mockSchedules = [
      {
        id: 1,
        name: '6-months schedule',
        doses: [{ id: 101, name: '1st dose' }],
        vaccine: { id: 201, name: 'Hepatitis B' }
      }
    ];

    Schedula.findAll.mockResolvedValue(mockSchedules);

    await getAllSchedules(req, res);

    expect(Schedula.findAll).toHaveBeenCalledWith({
      include: ['doses', 'vaccine']
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { schedules: mockSchedules }
    });
  });

  it('returns 500 if there is a database error', async () => {
    Schedula.findAll.mockRejectedValue(new Error('DB failed'));

    await getAllSchedules(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error: 'DB failed'
    });
  });
});



describe('getSchedulesByAge', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { age_group: '6-12 months' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('returns 200 and schedules for the given age group', async () => {
    const fakeSchedules = [
      {
        id: 1,
        age_group: '6-12 months',
        doses: [{ id: 101, name: 'Dose A' }],
        vaccine: { id: 201, name: 'Vaccine A' }
      }
    ];

    Schedula.findAll.mockResolvedValue(fakeSchedules);

    await getSchedulesByAge(req, res);

    expect(Schedula.findAll).toHaveBeenCalledWith({
      where: { age_group: '6-12 months' },
      include: ['doses', 'vaccine']
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { schedules: fakeSchedules }
    });
  });

  it('returns 404 if no schedules found for the age group', async () => {
    Schedula.findAll.mockResolvedValue([]);

    await getSchedulesByAge(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No schedule found for this age group.'
    });
  });

  it('returns 500 on database error', async () => {
    Schedula.findAll.mockRejectedValue(new Error('DB error'));

    await getSchedulesByAge(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error: 'DB error'
    });
  });
});