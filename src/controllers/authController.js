const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password: hash });
    res.status(201).json({ mensaje: 'Usuario registrado', id: user._id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ mensaje: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

exports.logout = (req, res) => {
  // JWT es sin estado: el cliente elimina el token
  res.json({ mensaje: 'Sesión cerrada. Elimina el token en el cliente.' });
};