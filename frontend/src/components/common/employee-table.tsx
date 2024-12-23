'use client'

import React, {useState} from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {EmployeeForm} from './employee-form'
import {Employee} from "@/hooks/use-employee";

interface EmployeeTableProps {
    employees: Employee[]
    onUpdate: (idEmployee: number, data: Partial<Employee>) => Promise<void>
    onDelete: (idEmployee: number) => Promise<void>
}

export function EmployeeTable({employees, onUpdate, onDelete}: EmployeeTableProps) {
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

    const handleUpdate = async (data: Partial<Employee>) => {
        if (editingEmployee) {
            await onUpdate(editingEmployee.idEmployee, data)
            setEditingEmployee(null)
        }
    }

    return (
        <>
            <Table>
                <TableCaption>Liste des employés</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Date de naissance</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.fullName}>
                            <TableCell className="font-medium">{employee.fullName}</TableCell>
                            <TableCell>{new Date(employee.dateOfBirth).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" onClick={() => setEditingEmployee(employee)}>
                                                Modifier
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Modifier l'employé</DialogTitle>
                                            </DialogHeader>
                                            <EmployeeForm
                                                onSubmit={handleUpdate}
                                                initialData={{
                                                    fullName: employee.fullName,
                                                    dateOfBirth: employee.dateOfBirth,
                                                }}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" onClick={() => onDelete(employee.idEmployee)}>
                                        Supprimer
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

