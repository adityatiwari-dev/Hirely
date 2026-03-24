package com.aditya.jobportalbackend.service;

import com.aditya.jobportalbackend.model.Job;
import com.aditya.jobportalbackend.repository.JobRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Service
public class JobService {
    private final JobRepo jobRepo;

    public JobService(JobRepo jobRepo){
        this.jobRepo = jobRepo;
    }

    @PostMapping
    public Job addJob(@RequestBody Job job){
        return jobRepo.save(job);
    }

    @GetMapping
    public List<Job> getAllJob(){
        return jobRepo.findAll();
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable int id){
        return jobRepo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable int id, @RequestBody Job newJob){
        Job job = jobRepo.findById(id).orElse(null);

        if (job != null) {
            job.setTitle(newJob.getTitle());
            job.setSalary(newJob.getSalary());
            job.setLocation(newJob.getLocation());
            job.setCompany(newJob.getCompany());
            return jobRepo.save(job);
        }
        return null;
    }

    @GetMapping("/{location}")
    public List<Job> getJobByLocation(@RequestBody String location){
        return jobRepo.findByLocation(location);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable int id) {
        jobRepo.deleteById(id);
        return "Job Deleted Successfully";
    }

}
