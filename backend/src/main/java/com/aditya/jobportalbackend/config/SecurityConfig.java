package com.aditya.jobportalbackend.config;

import com.aditya.jobportalbackend.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(customizer -> customizer.disable())
                .userDetailsService(customUserDetailsService)
                .authorizeHttpRequests(auth -> auth
                        // Admin APIs
                        .requestMatchers(HttpMethod.POST, "/jobs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/jobs/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/jobs/*").hasRole("ADMIN")
                        .requestMatchers("/jobs/applications/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/jobs/apply/**").hasRole("USER")
                        .requestMatchers("/jobs/applications").hasRole("USER")

                        // Public APIs
                        .requestMatchers("/jobs").permitAll()
                        .requestMatchers("/register").permitAll()
                        .requestMatchers("/jobs/*").permitAll()
                        .requestMatchers("/jobs/search").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
