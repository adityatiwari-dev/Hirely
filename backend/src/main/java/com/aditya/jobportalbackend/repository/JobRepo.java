package com.aditya.jobportalbackend.repository;

import com.aditya.jobportalbackend.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepo extends JpaRepository<Job, Integer> {
    List<Job> findByLocation(String location);
}
