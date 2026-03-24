import React, { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [newJob, setNewJob] = useState({
    jobTitle: "",
    company: "",
    location: "",
    salary: ""
  });

  // Fetch jobs
  const fetchJobs = () => {
    fetch("http://localhost:8080/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  // Add job
  const addJob = () => {
    fetch("http://localhost:8080/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobTitle: newJob.jobTitle,
        company: newJob.company,
        location: newJob.location,
        salary: Number(newJob.salary)
      })
    }).then(() => {
      fetchJobs();
      setNewJob({ jobTitle: "", company: "", location: "", salary: "" });
    });
  };

  const deleteJob = (id) => {
    console.log("Deleting ID:", id);

    fetch(`http://localhost:8080/jobs/${id}`, {
      method: "DELETE"
    }).then(() => fetchJobs());
  };

  const searchJobs = (location) => {
    fetch(`http://localhost:8080/jobs/search?location=${location}`)
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  const updateJob = () => {
    fetch(`http://localhost:8080/jobs/${editJob.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editJob)
    }).then(() => {
      fetchJobs();
      setEditJob(null);
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💼 Job Portal</h1>

      {/* FORM */}
      <div style={styles.form}>
        <h2>{editJob ? "Update Job" : "Add New Job"}</h2>

        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search jobs by location..."
            style={styles.searchInput}
            onChange={(e) => searchJobs(e.target.value)}
          />
        </div>

        <input
          style={styles.input}
          name="jobTitle"
          placeholder="Job jobTitle"
          value={editJob ? editJob.jobTitle : newJob.jobTitle}
          onChange={(e) =>
            editJob
              ? setEditJob({ ...editJob, jobTitle: e.target.value })
              : setNewJob({ ...newJob, jobTitle: e.target.value })
          }
        />

        <input
          style={styles.input}
          name="company"
          placeholder="Company"
          value={editJob ? editJob.company : newJob.company}
          onChange={(e) =>
            editJob
              ? setEditJob({ ...editJob, company: e.target.value })
              : setNewJob({ ...newJob, company: e.target.value })
          }
        />

        <input
          style={styles.input}
          name="location"
          placeholder="Location"
          value={editJob ? editJob.location : newJob.location}
          onChange={(e) =>
            editJob
              ? setEditJob({ ...editJob, location: e.target.value })
              : setNewJob({ ...newJob, location: e.target.value })
          }
        />

        <input
          style={styles.input}
          name="salary"
          placeholder="Salary"
          value={editJob ? editJob.salary : newJob.salary}
          onChange={(e) =>
            editJob
              ? setEditJob({ ...editJob, salary: e.target.value })
              : setNewJob({ ...newJob, salary: e.target.value })
          }
        />

        <button style={styles.primaryBtn} onClick={editJob ? updateJob : addJob}>
          {editJob ? "Update Job" : "Add Job"}
        </button>
      </div>

      {/* JOB LIST */}
      <div style={styles.grid}>
        {jobs.map((job) => (
          <div key={job.id} style={styles.card}>
            <h3>{job.jobTitle}</h3>
            <p><strong>{job.company}</strong></p>
            <p>{job.location}</p>
            <p>💰 ₹{job.salary}</p>

            <div style={styles.buttonGroup}>
              <button
                style={styles.editBtn}
                onClick={() => {
                  setEditJob(job);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    fontFamily: "Arial"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  form: {
    background: "#f4f4f4",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  primaryBtn: {
    background: "#007bff",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  editBtn: {
    background: "orange",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: "30px",
    padding: "10px 15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },

  searchIcon: {
    fontSize: "18px",
    marginRight: "10px",
    color: "#888"
  },

  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "16px",
    width: "100%",
    background: "transparent"
  }
};