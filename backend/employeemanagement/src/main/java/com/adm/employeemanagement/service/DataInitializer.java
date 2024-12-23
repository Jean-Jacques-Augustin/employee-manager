package com.adm.employeemanagement.service;

import com.adm.employeemanagement.model.Employee;
import com.adm.employeemanagement.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    public DataInitializer(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        long count = employeeRepository.count();

        if (count == 0) {
            for (int i = 1; i <= 10; i++) {
                String name = "Employee " + i;

                LocalDate dateOfBirth = LocalDate.of(1990, 1, 1).plusDays(i);

                Employee emp = new Employee(name, dateOfBirth);
                employeeRepository.save(emp);
            }

            System.out.println("===== 10 employés insérés dans la base. =====");
        } else {
            System.out.println("===== La table Employee n’est pas vide, pas d’insertion. =====");
        }
    }
}