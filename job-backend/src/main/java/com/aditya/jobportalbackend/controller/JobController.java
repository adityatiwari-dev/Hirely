package com.aditya.jobportalbackend.controller;

import com.aditya.jobportalbackend.model.Job;
import com.aditya.jobportalbackend.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService service;

    public JobController(JobService service){
        this.service = service;
    }

    // Create
    @PostMapping
    public Job addJob(@RequestBody Job job){
        return service.addJob(job);
    }


    // Read All
    @GetMapping
    public List<Job> getAlljobs() {
        return service.getAllJob();
    }

    // Read One
    @GetMapping("/{id}")
    public Job getJob(@PathVariable int id) {
        return service.getJobById(id);
    }


    // Update
    @PutMapping("/{id}")
    public Job updateJob(@PathVariable int id, @RequestBody Job newJob) {
        Job job = service.getJobById(id);

        if (job != null) {
            job.setTitle(newJob.getTitle());
            job.setCompany(newJob.getCompany());
            job.setLocation(newJob.getLocation());
            job.setSalary(newJob.getSalary());
            return service.addJob(job);
        }

        return null;
    }

    @GetMapping("/search")
    public List<Job> searchByLocation(@RequestParam String location) {
        return service.getJobByLocation(location);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable int id) {
        service.deleteJob(id);
        return "Job Deleted";
    }

}