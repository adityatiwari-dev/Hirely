package com.aditya.jobportalbackend.controller;

import com.aditya.jobportalbackend.model.User;
import com.aditya.jobportalbackend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {

    @Autowired
    private UserRepo repo;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        repo.save(user);

        return "User registered";
    }
}
