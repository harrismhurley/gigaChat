import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = 'your-secret-key'; // Replace with your actual secret key

// Helper function to generate a JWT token
export const generateToken = (user: { id: string; email: string }): string => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
};

// Helper function to verify a password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
