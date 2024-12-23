import {useState, useCallback} from 'react'

const API_URL = 'http://localhost:8080/api/employees'

export interface Employee {
    idEmployee: number
    fullName: string
    dateOfBirth: string
}

export function useEmployees(initialEmployees: Employee[], token?: string) {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchEmployees = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!res.ok) throw new Error('Échec de la récupération des employés')
            const data = await res.json()
            setEmployees(data)
        } catch (err) {
            setError('Échec de la récupération des employés: ' + err)
        } finally {
            setIsLoading(false)
        }
    }, [token])

    const addEmployee = useCallback(async (employeeData: Omit<Employee, 'idEmployee'>) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(employeeData),
            })
            if (!res.ok) throw new Error("L'utilisateur existe déjà")
            await fetchEmployees()
        } catch (err) {
            setError('Échec de l\'ajout de l\'employé: ' + err)
        } finally {
            setIsLoading(false)
        }
    }, [token, fetchEmployees])

    const updateEmployee = useCallback(async (idEmployee: number, employeeData: Partial<Employee>) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_URL}/${idEmployee}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(employeeData),
            })
            if (!res.ok) throw new Error('Échec de la mise à jour de l\'employé')
            await fetchEmployees()
        } catch (err) {
            setError('Échec de la mise à jour de l\'employé: ' + err)
        } finally {
            setIsLoading(false)
        }
    }, [token, fetchEmployees])

    const deleteEmployee = useCallback(async (idEmployee: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_URL}/${idEmployee}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) throw new Error('Échec de la suppression de l\'employé')
            await fetchEmployees()
        } catch (err) {
            setError('Échec de la suppression de l\'employé: ' + err)
        } finally {
            setIsLoading(false)
        }
    }, [token, fetchEmployees])

    return {
        employees,
        isLoading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        refreshEmployees: fetchEmployees
    }
}