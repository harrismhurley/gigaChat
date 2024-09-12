import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = 'your-secret-key';

// Helper function to generate a JWT token
export const generateToken = (user: { id: string; username: string }): string => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

// Helper function to verify a password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  console.log('Password before hashing:', password); // Log the password before hashing
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Password after hashing:', hashedPassword); // Log the hashed password
  return hashedPassword;
};
