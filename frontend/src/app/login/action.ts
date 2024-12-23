'use server'

import {cookies} from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

interface LoginState {
    error?: string
    redirectUrl?: string
}

interface LoginResponse {
    user?: string
    token?: string
    message?: string
}

function parseSpringUserString(userStr: string) {
    const rolesRegex = /roles=\[([^]+?)\]/;
    const usernameRegex = /username=(.+)\}/;

    const rolesMatch = userStr.match(rolesRegex);
    const userMatch = userStr.match(usernameRegex);

    let roles: string[] = [];
    let username = "";

    if (rolesMatch && rolesMatch[1]) {
        roles = rolesMatch[1].split(",").map(r => r.trim());
    }

    if (userMatch && userMatch[1]) {
        username = userMatch[1].trim();
    }

    return {roles, username};
}

export async function login(
    prevState: LoginState,
    formData: FormData
): Promise<any> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: email,
                password: password,
            }),
        })
        if (!response.ok) {
            return {error: 'Invalid credentials'}
        }
        const rawText = await response.text()
        let data: LoginResponse
        try {
            data = JSON.parse(rawText)
        } catch (err) {
            console.error('Error parsing JSON:', err)
            return {error: 'Invalid JSON response from server'}
        }

        if (!data.token) {
            console.error('Unexpected server response:', data)
            return {error: 'Server response missing token'}
        }

        const parsedUser = data.user ? parseSpringUserString(data.user) : {roles: [], username: ''};

        const cookieStore = await cookies();
        cookieStore.set('token', data.token, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/'
        });
        cookieStore.set('roles', JSON.stringify(parsedUser.roles), {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: true,
            httpOnly: true,
            path: '/'
        });
        cookieStore.set('username', parsedUser.username, {
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            secure: true,
            httpOnly: true,
            path: '/'
        });

        return {redirectUrl: '/'}

    } catch (error) {
        console.error('Login error:', error)
        return {error: 'Email non reconnu'}
    }
}