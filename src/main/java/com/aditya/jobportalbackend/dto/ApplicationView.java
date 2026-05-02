package com.aditya.jobportalbackend.dto;

public class ApplicationView {
    private int id;
    private String username;
    private int jobId;
    private String jobTitle;
    private String jobCompany;
    private String jobLocation;
    private Integer jobSalary;

    public ApplicationView() {}

    public ApplicationView(int id, String username, int jobId, String jobTitle, String jobCompany, String jobLocation, Integer jobSalary) {
        this.id = id;
        this.username = username;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.jobCompany = jobCompany;
        this.jobLocation = jobLocation;
        this.jobSalary = jobSalary;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobCompany() {
        return jobCompany;
    }

    public void setJobCompany(String jobCompany) {
        this.jobCompany = jobCompany;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public Integer getJobSalary() {
        return jobSalary;
    }

    public void setJobSalary(Integer jobSalary) {
        this.jobSalary = jobSalary;
    }
}

