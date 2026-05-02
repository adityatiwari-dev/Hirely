package com.aditya.jobportalbackend.repository;

import com.aditya.jobportalbackend.model.JobApplications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<JobApplications, Integer> {
    List<JobApplications> findByUsername(String username);
}
