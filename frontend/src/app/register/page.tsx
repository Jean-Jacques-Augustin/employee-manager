'use client';

import {useState} from "react";
import {useActionState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Mail, Lock, Loader2} from "lucide-react";
import Link from "next/link";
import {register} from "@/app/register/action";

const initialState = {error: ''};

export default function RegisterPage() {
    const [state, formAction] = useActionState(register, initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return `Le mot de passe doit comporter au moins ${minLength} caractères.`;
        }
        if (!hasUpperCase) {
            return "Le mot de passe doit contenir au moins une lettre majuscule.";
        }
        if (!hasLowerCase) {
            return "Le mot de passe doit contenir au moins une lettre minuscule.";
        }
        if (!hasNumber) {
            return "Le mot de passe doit contenir au moins un chiffre.";
        }
        if (!hasSpecialChar) {
            return "Le mot de passe doit contenir au moins un caractère spécial.";
        }
        return '';
    };

    const handleSubmit = async (formData: FormData) => {
        const password = formData.get('password') as string;
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        setPasswordError('');
        setIsLoading(true);
        await formAction(formData);
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Inscription
                    </CardTitle>
                    <CardDescription className="text-center">
                        Créez votre compte pour accéder à l'application
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse e-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                          size={18}/>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="nom@exemple.com"
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                          size={18}/>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10"
                                    />
                                </div>
                                {passwordError && (
                                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                                )}
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Inscription en cours...
                                </>
                            ) : (
                                'S\'inscrire'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className={`flex flex-col w-full`}>
                    <Link href={'/login'} className="w-full">
                        <Button variant="outline" className="w-full">
                            Déjà un compte ? Connectez-vous
                        </Button>
                    </Link>
                    {state.error && (
                        <p className="text-sm text-red-500 mt-2 text-center w-full" role="alert">
                            {state.error}
                        </p>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
