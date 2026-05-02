package com.aditya.jobportalbackend.controller;

import com.aditya.jobportalbackend.dto.ApplicationView;
import com.aditya.jobportalbackend.model.JobApplications;
import com.aditya.jobportalbackend.model.Job;
import com.aditya.jobportalbackend.repository.ApplicationRepo;
import com.aditya.jobportalbackend.service.JobService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private final JobService service;

    @Autowired
    private ApplicationRepo applicationRepo;

    public JobController(JobService service){
        this.service = service;
    }

    // Create (ADMIN)
    @PostMapping
    public Job addJob(@RequestBody Job job){
        return service.addJob(job);
    }

    // Read All (PUBLIC)
    @GetMapping
    public List<Job> getAlljobs() {
        return service.getAllJob();
    }

    // Read One (PUBLIC)
    @GetMapping("/{id}")
    public Job getJob(@PathVariable int id) {
        return service.getJobById(id);
    }

    // Update (ADMIN)
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

    // Search (PUBLIC)
    @GetMapping("/search")
    public List<Job> searchByLocation(@RequestParam String location) {
        return service.getJobByLocation(location);
    }

    // Delete (ADMIN)
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable int id) {
        service.deleteJob(id);
        return "Job Deleted";
    }

    // ✅ APPLY JOB (USER)
    @PostMapping("/apply/{jobId}")
    public String applyJob(@PathVariable int jobId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        JobApplications app = new JobApplications();
        app.setUsername(username);
        app.setJobId(jobId);

        applicationRepo.save(app);

        return "Applied successfully";
    }

    @GetMapping("/applications")
    public List<JobApplications> getMyApplications() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return applicationRepo.findByUsername(username);
    }

    // ✅ ADMIN: View all applications
    @GetMapping("/applications/all")
    public List<ApplicationView> getAllApplicationsForAdmin() {
        List<JobApplications> apps = applicationRepo.findAll();
        List<ApplicationView> result = new ArrayList<>();

        for (JobApplications app : apps) {
            Job job = service.getJobById(app.getJobId());
            result.add(
                    new ApplicationView(
                            app.getId(),
                            app.getUsername(),
                            app.getJobId(),
                            job != null ? job.getTitle() : null,
                            job != null ? job.getCompany() : null,
                            job != null ? job.getLocation() : null,
                            job != null ? job.getSalary() : null
                    )
            );
        }

        return result;
    }
}