'use client'

import {useState} from "react"
import {login} from "@/app/login/action"
import {useActionState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Mail, Lock, Loader2} from 'lucide-react'
import Link from "next/link";
import { redirect } from "next/navigation"

const initialState = {error: ''}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        formAction(formData)
        setIsLoading(false)
    }

    if (state.redirectUrl) {
        redirect("/")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">
                        Entrez vos identifiants pour accéder à votre compte
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
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Connexion en cours...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter
                    className={`flex flex-col w-full`}
                >
                    {state.error && (
                        <p className="text-sm text-red-500 text-center w-full" role="alert">
                            {state.error}
                        </p>
                    )}

                    <Link href={'/register'} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full"
                        >
                            Créer un compte
                        </Button>
                    </Link>


                </CardFooter>
            </Card>
        </div>
    )
}

