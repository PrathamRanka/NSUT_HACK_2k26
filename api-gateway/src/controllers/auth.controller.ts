import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'sahayak-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, name, role } = req.body;

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Create user
            const user = await User.create({
                email,
                password,
                name,
                role: role || 'officer'
            });

            // Generate token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error: any) {
            console.error('Register error:', error);
            res.status(500).json({ error: error.message || 'Registration failed' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ error: error.message || 'Login failed' });
        }
    }

    static async getProfile(req: any, res: Response) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
