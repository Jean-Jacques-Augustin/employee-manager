'use client'

import React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"

const employeeSchema = z.object({
    fullName: z.string().min(2, {message: "Le nom doit contenir au moins 2 caractères"}),
    dateOfBirth: z.string().refine((date: string | number | Date) => {
        const parsedDate = new Date(date)
        return !isNaN(parsedDate.getTime()) && parsedDate < new Date()
    }, {message: "La date de naissance doit être valide et dans le passé"})
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeFormProps {
    onSubmit: (data: EmployeeFormData) => Promise<void>
    initialData?: EmployeeFormData
}

export function EmployeeForm({onSubmit, initialData}: EmployeeFormProps) {
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData || {fullName: '', dateOfBirth: ''}
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                Entrez le nom complet de l'employé
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                                Sélectionnez la date de naissance de l'employé
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit">Soumettre</Button>
            </form>
        </Form>
    )
}

