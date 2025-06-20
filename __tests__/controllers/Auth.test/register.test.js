jest.mock('../../../db/Validators/registerValidation', () => ({
  registerSchema: {
    validate: jest.fn(() => ({ error: null })) // Simulate passing validation
  }
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { register , Login ,FrogetPass , VerifyResetCode  } = require('../../../Controllers/auth.controller');
const User = require('../../../db/Models/userModel');
const Baby = require('../../../db/Models/babyModel');
const Notification = require('../../../db/Models/notificationModel');
const sendEmail = require('../../../utils/sendEmail');
const crypto = require('crypto');
const { sequelize } = require('../../../Config/db');
const { Op } = require("sequelize");
const {registerSchema} = require('../../../db/Validators/registerValidation')



jest.mock('../../../db/Models/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('../../../db/Models/babyModel', () => ({
  create: jest.fn(),
}));

jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  return {
    DataTypes: actualSequelize.DataTypes, 
  };
});

jest.mock('../../../Config/db', () => ({
  sequelize: {
    transaction: jest.fn(),
    define: jest.fn(() => ({})),
  },
}));

jest.mock('../../../db/Models/notificationModel');
jest.mock('../../../utils/sendEmail');



describe('user register' , ()=>{
  let req;
  let res;
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        name: 'Menna',
        email: 'menna@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        baby_name: 'Luna',
        birth_date: '2023-01-01',
        gender: 'female',
        medical_conditions: 'None',
      },
      protocol: 'http',
      get: () => 'localhost:3000',
      file: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    sequelize.transaction.mockResolvedValue(mockTransaction);
  });


  test('should start a transaction before validation', async () => {
    const spy = jest.spyOn(sequelize, 'transaction');
    User.findOne.mockResolvedValue(null);
  
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');
    jwt.sign = jest.fn().mockReturnValue('mocked_jwt_token');
    User.create.mockResolvedValue({ user_id: 1, email: 'menna@example.com', name: 'Menna' });
    Baby.create.mockResolvedValue({
      baby_id: 1,
      baby_name: 'Luna',
      birth_date: '2023-01-01',
      age_in_months: 17,
      gender: 'female',
      medical_conditions: 'None'
    });
  
    await register(req, res);
  
    expect(spy).toHaveBeenCalled();
  });

  test('should return validation error if input is invalid', async () => {
     // Force validation to fail
  registerSchema.validate.mockReturnValue({
    error: {
      details: [{ message: 'Invalid input' }],
    },
  });

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    message: 'Validation error',
    details: expect.any(Array),
  }));
  });

  test('should return 400 if user already exists', async () => {
    registerSchema.validate.mockReturnValue({ value: req.body });

    User.findOne.mockResolvedValue({ user_id: 1, email: 'menna@example.com' });
  
    await register(req, res);
  
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });


  test('should hash the password', async () => {
    req.body = {
      name: 'Menna',
      email: 'menna@example.com',
      password: 'pass123',
      confirmPassword: 'pass123',
      baby_name: 'Luna',
      birth_date: '2023-01-01',
      gender: 'female',
      medical_conditions: 'None',
    };
  
    req.file = null;
  
    registerSchema.validate.mockReturnValue({ value: req.body });
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
  
    User.create.mockResolvedValue({ user_id: 1 });
    Baby.create.mockResolvedValue({});
  
    await register(req, res);
  
    expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
  });
  

  test('should build profile picture URL if file exists', async () => {
    req.body = {
      name: 'Menna',
      email: 'menna@example.com',
      password: 'pass123',
      confirmPassword: 'pass123',
      baby_name: 'Luna',
      birth_date: '2023-01-01',
      gender: 'female',
      medical_conditions: 'None',
    };
  
    req.file = { filename: 'profile.jpg' };
    req.protocol = 'http';
    req.get = () => 'localhost:3000';
  
    registerSchema.validate.mockReturnValue({ value: req.body });
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed_password');
  
    User.create.mockResolvedValue({ user_id: 1 });
    Baby.create.mockResolvedValue({});
  
    await register(req, res);
  
    const expectedUrl = `${req.protocol}://${req.get()}/uploads/${req.file.filename}`;
    const userDataArg = User.create.mock.calls[0][0];
  
    expect(userDataArg).toEqual(expect.objectContaining({
      profile_picture: expectedUrl,
    }));
 });


 test('should create user and baby with correct data', async () => {
  const birthDate = '2023-01-01';
  const mockUserId = 1;

  req.body = {
    name: 'Menna',
    email: 'menna@example.com',
    password: 'pass123',
    confirmPassword: 'pass123',
    baby_name: 'Luna',
    birth_date: birthDate,
    gender: 'female',
    medical_conditions: 'None',
  };

  req.file = null;
  req.protocol = 'http';
  req.get = () => 'localhost:3000';

  // Mocks
  registerSchema.validate.mockReturnValue({ value: req.body });
  User.findOne.mockResolvedValue(null);
  bcrypt.hash.mockResolvedValue('hashed_password');

  const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
  sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

  

  const mockUser = { user_id: mockUserId };
  User.create.mockResolvedValue(mockUser);
  Baby.create.mockResolvedValue({});

  await register(req, res);

   // Verify User.create
   expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
    email: 'menna@example.com',
    password: 'hashed_password',
    name: 'Menna',
    profile_picture: null,
    is_verified: false,
   }), { transaction: mockTransaction });

    // Manually calculate age
    const now = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

    // Verify Baby.create
    expect(Baby.create).toHaveBeenCalledWith(expect.objectContaining({
        user_id: mockUserId,
        baby_name: 'Luna',
        birth_date: birthDate,
        age_in_months: ageInMonths,
        gender: 'female',
        medical_conditions: 'None',
    }), { transaction: mockTransaction });
  });


  

})


describe('user Login ', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'menna@example.com',
        password: 'password123'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if email or password is missing', async () => {
    req.body = { email: '', password: '' };
    await Login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  test('should return 404 if user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await Login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('should return 401 if password is incorrect', async () => {
    const user = { password: 'hashed_password' };
    User.findOne.mockResolvedValue(user);
    bcrypt.compare = jest.fn().mockResolvedValue(false); 

    await Login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('should return 200 and token on successful login', async () => {
    User.findOne = jest.fn().mockResolvedValue({
      user_id: '123',
      name: 'Menna',
      email: 'menna@example.com',
      password: 'hashed_password',
      profile_picture: 'pic.jpg',
      number_of_baby: 1
    });
    
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('mocked_jwt_token');
    Notification.create = jest.fn().mockResolvedValue({}); 
    
    await Login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Login successful',
      token: 'mocked_jwt_token',
      user: expect.objectContaining({
        email: 'menna@example.com'
      })
    }));
  });

  test('should handle server error', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));

    await Login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "DB error"
    });
  });
});


describe('Forget Password ', () => {
  let req, res, mockUser;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        email: 'menna@example.com'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockUser = {
      name: 'Menna',
      email: 'menna@example.com',
      save: jest.fn(),
    };
  });

  it('should return 400 if email is missing', async () => {
    req.body.email = '';

    await FrogetPass(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
  });

  it('should return 404 if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    await FrogetPass(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'menna@example.com' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should generate reset code, hash it, save user and send email', async () => {
    User.findOne.mockResolvedValue(mockUser);

    const hashSpy = jest.spyOn(crypto, 'createHash');

    await FrogetPass(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'menna@example.com' } });
    expect(mockUser.passResetCode).toBeDefined();
    expect(mockUser.passResetExpires).toBeDefined();
    expect(mockUser.passVerified).toBe(false);
    expect(mockUser.save).toHaveBeenCalled();

    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      email: mockUser.email,
      subject: expect.stringContaining('Reset Code'),
      message: expect.stringContaining('we recived a request'),
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reset code sent to your email' });

    hashSpy.mockRestore();
  });
});


describe('VerifyResetCode ', () => {
  let req, res, mockUser;

  const Op = sequelize.Op = { gt: Symbol('gt') }; 
  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: { resetCode: '123456' } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockUser = {
      passVerified: false,
      save: jest.fn()
    };
  });

  it('should return 400 if resetCode is missing', async () => {
    req.body.resetCode = '';

    await VerifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Reset code is required' });
  });

  // it('should return 404 if resetCode is invalid or expired', async () => {
  //   const req = {
  //     body: {
  //       resetCode: "123456",
  //     },
  //   };
  
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };
  
  //   const hashed = crypto.createHash('sha256').update('123456').digest('hex');
  
  //   User.findOne = jest.fn().mockResolvedValue(null);
  //   await VerifyResetCode(req, res);
  
  //   expect( User.findOne ).toHaveBeenCalledWith({
  //     where: {
  //       passResetCode: hashed,
  //       passResetExpires: {
  //         [Op.gt]: expect.any(Date),
  //       },
  //     },
  //   });

  //   expect(res.status).toHaveBeenCalledWith(404);
  //   expect(res.json).toHaveBeenCalledWith({
  //     message: 'Reset code invalide or expired ',
  //   });
  // });



  // it('should verify reset code and update user', async () => {
  //   const resetCode = '123456';
  //   const hashed = crypto.createHash('sha256').update(resetCode).digest('hex');

  //   const mockUser = {
  //     passVerified: false,
  //     save: jest.fn(),
  //   };

  //   const req = {
  //     body: { resetCode }
  //   };

  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn()
  //   };

  //   // 👇 Mock User.findOne to return our mock user
  //   User.findOne.mockResolvedValue(mockUser);

  //   await VerifyResetCode(req, res);

  //   // ✅ Confirm findOne was called with correct hashed code
  //   expect(User.findOne).toHaveBeenCalledWith({
  //     where: {
  //       passResetCode: hashed,
  //       passResetExpires: { [Op.gt]: expect.any(Date) }
  //     }
  //   });

  //   // ✅ Confirm user was modified and saved
  //   expect(mockUser.passVerified).toBe(true);
  //   expect(mockUser.save).toHaveBeenCalled();

  //   // ✅ Confirm response
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({
  //     status: "success",
  //     Message: "you are verified "
  //   });
  // });


});