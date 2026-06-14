import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lumiere_secret_key_123';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'Staff' | 'Customer';
}

export const auth = {
  // Password hashing
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  // Password verification
  verifyPassword: async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
  },

  // JWT Token Signing
  signToken: (payload: JWTPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  },

  // JWT Token Verification
  verifyToken: (token: string): JWTPayload | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as JWTPayload;
    } catch (err) {
      console.error('Invalid/Expired JWT token');
      return null;
    }
  }
};
