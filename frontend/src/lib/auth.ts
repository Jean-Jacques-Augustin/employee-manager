"use client";

import {jwtVerify, SignJWT} from 'jose';
import {cookies} from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function createToken(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    try {
        const {payload} = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return payload;
    } catch (error) {
        console.error('Failed to verify token:', error);
        return null;
    }
}

