const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Валидация входных данных
function validateCredentials(body) {
  const { email, password } = body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'Valid email is required';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const error = validateCredentials(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const { email, password } = req.body;

    // Проверяем, что email не занят
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await User.create({
      email,
      passwordHash,
      role: 'user'
    });

    // Отдаём без пароля
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Ищем пользователя
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Сравниваем пароль с хешем
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генерируем JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/profile (защищённый)
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};