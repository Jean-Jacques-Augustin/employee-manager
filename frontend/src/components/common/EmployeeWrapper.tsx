'use client'

import React, {useEffect, useState} from 'react'
import {EmployeeForm} from './employee-form'
import {EmployeeTable} from './employee-table'
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Loader2, UserPlus, Users} from 'lucide-react'
import {Employee, useEmployees} from "@/hooks/use-employee"
import {useToast} from "@/hooks/use-toast"

interface EmployeesClientProps {
    initialEmployees: Employee[];
    token?: string;
}

export function EmployeesClient({initialEmployees, token}: EmployeesClientProps) {
    const {toast} = useToast()
    const {
        employees,
        isLoading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        refreshEmployees
    } = useEmployees(initialEmployees, token)

    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [employeesPerPage] = useState(10)

    useEffect(() => {
        if (error) {
            toast({
                title: "Erreur",
                description: error,
                variant: "destructive",
            })
        }
    }, [error, toast])

    const filteredEmployees = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.dateOfBirth.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const indexOfLastEmployee = currentPage * employeesPerPage
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div className="container w-full mx-auto space-y-6 transition-colors duration-200">
            <div className="flex justify-between items-center py-4">
                <h1 className="text-3xl font-bold">Gestion des Employés</h1>
            </div>

            <Tabs value={activeTab} onValueChange={(val: string) => setActiveTab(val as 'list' | 'add')}>
                <TabsList className="mb-4">
                    <TabsTrigger value="list">
                        <Users className="mr-2 h-4 w-4"/>
                        Liste des employés
                    </TabsTrigger>
                    <TabsTrigger value="add">
                        <UserPlus className="mr-2 h-4 w-4"/>
                        Ajouter un employé
                    </TabsTrigger>
                </TabsList>

                <div className="transition-opacity duration-200 ease-in-out">
                    <TabsContent value="list">
                        <Card>
                            <CardHeader>
                                <CardTitle>Liste des employés</CardTitle>
                                <CardDescription>
                                    Gérez et visualisez tous vos employés ici.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="Rechercher un employé..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-4"
                                />
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="h-8 w-8 animate-spin"/>
                                    </div>
                                ) : (
                                    <>
                                        <EmployeeTable
                                            employees={currentEmployees}
                                            onUpdate={updateEmployee}
                                            onDelete={deleteEmployee}
                                        />
                                        <div className="mt-4 flex justify-center">
                                            {Array.from({length: Math.ceil(filteredEmployees.length / employeesPerPage)}, (_, i) => (
                                                <Button
                                                    key={i}
                                                    variant={currentPage === i + 1 ? "default" : "outline"}
                                                    className="mx-1"
                                                    onClick={() => paginate(i + 1)}
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={refreshEmployees} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                        Rafraîchir la liste
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="add">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ajouter un nouvel employé</CardTitle>
                                <CardDescription>
                                    Remplissez les informations pour créer un nouvel employé.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EmployeeForm onSubmit={addEmployee}/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

