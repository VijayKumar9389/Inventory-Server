import jwt from 'jsonwebtoken';
import {User} from "@prisma/client";

export const generateAccessToken = (user: User): string => {
    const expiresIn = '15min';
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        },
        'secret',
        { expiresIn }
    );
};

export const generateRefreshToken = (user: User): string => {
    const expiresIn = '1hr';
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
        },
        'secret',
        { expiresIn }
    );
};

export const validateAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, 'secret');
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

export const validateRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, 'secret');
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};
