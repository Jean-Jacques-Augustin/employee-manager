'use server';

interface LoginState {
    error?: string;
    redirectUrl?: string;
}

interface RegisterResponse {
    message?: string;
    error?: string;
}

export async function register(
    prevState: LoginState,
    formData: FormData
): Promise<RegisterResponse> {
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;
    if (!email || !password) {
        return {error: 'Email ou mot de passe manquant.'};
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: email, password}),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            return {error: errorMessage || 'Erreur inconnue. Réessayez plus tard.'};
        }

        const message = await response.text();
        return {message};

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return {error: error.message};
    }
}
