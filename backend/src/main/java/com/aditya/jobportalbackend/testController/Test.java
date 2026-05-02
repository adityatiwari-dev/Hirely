package com.aditya.jobportalbackend.testController;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/")
    public String home() {
        return "Backend is running";
    }
}
