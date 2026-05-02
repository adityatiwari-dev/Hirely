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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
                "https://hirely-git-main-adityatiwari-devs-projects.vercel.app",
                "https://hirely-six-navy.vercel.app"
        )); // allow all
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(customizer -> customizer.disable())
                .cors(Customizer.withDefaults())
                .userDetailsService(customUserDetailsService)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
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
                        .requestMatchers("/").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
