import axios from 'axios'

// Backend contract (from your Spring Boot code):
// - Public:
//   - POST /register
//   - GET /jobs
//   - GET /jobs/{id}
//   - GET /jobs/search?location=...
// - ROLE_USER:
//   - POST /jobs/apply/{jobId}
//   - GET /jobs/applications
// - ROLE_ADMIN:
//   - POST /jobs
//   - PUT /jobs/{id}
//   - DELETE /jobs/{id}
//
// Dev proxy: Vite proxies /api -> http://localhost:8080 to avoid CORS issues
// (notably /register has no @CrossOrigin in backend).

export function createApiClient({ getAuthHeader }) {
  const client = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use((config) => {
    const auth = getAuthHeader?.()
    if (auth) config.headers.Authorization = auth
    return config
  })

  return {
    register: async ({ username, password }) => {
      const { data } = await client.post('/register', { username, password })
      return data
    },

    getJobs: async () => {
      const { data } = await client.get('/jobs')
      return data
    },

    getJobById: async (id) => {
      const { data } = await client.get(`/jobs/${id}`)
      return data
    },

    searchJobsByLocation: async (location) => {
      const { data } = await client.get('/jobs/search', { params: { location } })
      return data
    },

    createJob: async (job) => {
      const { data } = await client.post('/jobs', job)
      return data
    },

    updateJob: async (id, job) => {
      const { data } = await client.put(`/jobs/${id}`, job)
      return data
    },

    deleteJob: async (id) => {
      const { data } = await client.delete(`/jobs/${id}`)
      return data
    },

    applyToJob: async (jobId) => {
      const { data } = await client.post(`/jobs/apply/${jobId}`)
      return data
    },

    getMyApplications: async () => {
      const { data } = await client.get('/jobs/applications')
      return data
    },

    // ADMIN
    getAllApplicationsAdmin: async () => {
      const { data } = await client.get('/jobs/applications/all')
      return data
    },
  }
}

