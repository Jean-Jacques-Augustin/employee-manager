import {cookies} from "next/headers";
import {EmployeesClient} from "@/components/common/EmployeeWrapper";

async function getEmployees() {

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error('Failed to fetch employees')
    }

    return res.json()
}

export default async function EmployeesPage() {
    const initialEmployees = await getEmployees()
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return <div>Not authenticated</div>
    }


    return <EmployeesClient initialEmployees={initialEmployees}
                            token={token}
    />
}

