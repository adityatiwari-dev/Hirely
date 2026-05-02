package com.aditya.jobportalbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class JobPortalBackendApplication {

    public static void main(String[] args) {

        SpringApplication.run(JobPortalBackendApplication.class, args);

        System.out.println("Password is: "+ " " + new BCryptPasswordEncoder().encode("1709"));
    }

}
