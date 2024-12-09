import axios from 'axios';

// Unified base URL
const API_BASE_URL = 'https://dashstack-90hs.onrender.com/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to handle common headers
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage or any other storage
    const token = localStorage.getItem('token');
    console.log(token);
    // Add the Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Set Content-Type header for multipart requests
    if (config.isMultipart) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Register admin function not header
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    console.log(response.data)
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Registration failed due to a server error." };
  }
};

// User login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.response?.data?.message || "Login failed due to a server error." };
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to process the forgot password request." };
  }
};

// Verify OTP
export const verifyOtp = async (otpData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, otpData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("OTP verification error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to verify OTP." };
  }
};


// Reset Password
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, resetData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Reset password error:", error);
    return { success: false, message: error.response?.data?.message || "Password reset failed." };
  }
};

// Get user profile still remain update 
export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch user profile." };
  }
};

// Update user profile still remain update 
export const updateProfile = async (token, updateData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update profile." };
  }
};

// Create a new society function not header
export const createSociety = async (societyData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/society/create`, societyData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error creating society:", error);
    throw error;
  }
};

// Fetch all societies function not header
export const getSocieties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/society`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error fetching societies:", error);
    throw error;
  }
};

// Admin fetch important number  not header
export const fetchImportantNumbers = async () => {
  try {
    const response = await api.get('/important-numbers');
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error fetching important numbers:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch important numbers." };
  }
};

// Create a new important number
export const createImportantNumber = async (numberData) => {
  try {
    const response = await api.post('/important-numbers', numberData);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error creating important number:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create important number." };
  }
};

// Update an important number
export const updateImportantNumber = async (id, updatedData) => {
  try {
    const response = await api.put(`/important-numbers/${id}`, updatedData);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error updating important number:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update important number." };
  }
};

// Delete an important number
export const deleteImportantNumber = async (id) => {
  try {
    const response = await api.delete(`/important-numbers/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error deleting important number:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete important number." };
  }
};

/**
 * Expenses API Functions
 */

// Add a new expense
export const addExpense = async (expenseData, token) => {
  try {
    console.log(expenseData, token);

    const response = await api.post('/expenses/add', expenseData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error adding expense:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to add expense.' };
  }
};

// Update an existing expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    const response = await api.put(`/expenses/update/${expenseId}`, expenseData, { isMultipart: true });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating expense:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to update expense.' };
  }
};

// View a single expense by ID
export const viewExpense = async (expenseId) => {
  try {
    const response = await api.get(`/expenses/view/${expenseId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching expense:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch expense.' };
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. User might not be authenticated.");
    }
    console.log(expenseId)
    const response = await api.delete(`/expenses/delete/${expenseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Check if the response indicates success
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: "Failed to delete expense." };
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to delete expense.' };
  }
};

// List all expenses for the authenticated admin's society
export const listExpenses = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. User might not be authenticated.");
    }

    const response = await api.get('/expenses/list', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch expenses.' };
  }
};

// --- Notes Management APIs ---

// Add a new note
export const addNote = async (noteData) => {
  try {
    const response = await api.post('/notes/notes', noteData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error adding note:", error);
    return { success: false, message: error.response?.data?.message || "Failed to add note." };
  }
};

// Update an existing note
export const updateNote = async (id, noteData) => {
  try {
    const response = await api.put(`/notes/notes/${id}`, noteData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update note." };
  }
};

// Get all notes for the authenticated user
export const getNotes = async () => {
  try {
    const response = await api.get('/notes/notes');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch notes." };
  }
};

// Delete a note
export const deleteNote = async (id) => {
  try {
    const response = await api.delete(`/notes/notes/${id}`);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete note." };
  }
};

// Facility 

// Add Facility
export const addFacility = async (facilityData) => {
  try {
    const token = localStorage.getItem('token');
    console.log(facilityData)
    const response = await api.post('/facilities/facility', facilityData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error('Add facility error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to add facility.' };
  }
};

// Update Facility
export const updateFacility = async (facilityId, facilityData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/facilities/facility/${facilityId}`, facilityData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error('Update facility error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to update facility.' };
  }
};

// Get Facilities
export const getFacilities = async () => {
  try {
    const response = await api.get('/facilities/facility');
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error('Get facilities error:', error);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch facilities.' };
  }
};

// Create a complaint
export const createComplaint = async (complaintData) => {
  try {
    console.log(complaintData)
    const response = await api.post('/complaints/createComplaint', complaintData);
    console.log("asdadads", response)
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Create complaint error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create complaint." };
  }
};

// Update a complaint
export const updateComplaint = async (id, updateData) => {
  try {
    const response = await api.put(`/complaints/update/${id}`, updateData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Update complaint error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update complaint." };
  }
};

// View a specific complaint by ID
export const viewComplaint = async (id) => {
  try {
    const response = await api.get(`/complaints/view/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("View complaint error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to view complaint hello." };
  }
};

// Delete a complaint
export const deleteComplaint = async (id) => {
  try {
    const token = localStorage.getItem("token");
    console.log(id);

    const response = await api.delete(`/complaints/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Delete complaint error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete complaint." };
  }
};

// List all complaints for the admin's society
export const listComplaints = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get('/complaints/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("List complaints error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to list complaints." };
  }
};

// Create a new request
export const createRequest = async (requestData) => {
  try {
    console.log(requestData)
    const token = localStorage.getItem('token');
    const response = await api.post('/requests/createRequest', requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response);

    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error creating request:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create request." };
  }
};

// Update an existing request
export const updateRequest = async (id, updatedData) => {
  try {
    const response = await api.put(`/requests/update/${id}`, updatedData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error updating request:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update request." };
  }
};

// View a specific request
export const viewRequest = async (id) => {
  try {
    const response = await api.get(`/requests/view/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error viewing request:", error);
    return { success: false, message: error.response?.data?.message || "Failed to view request." };
  }
};

// Delete a specific request
export const deleteRequest = async (id) => {
  try {
    const response = await api.delete(`/requests/delete/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error deleting request:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete request." };
  }
};

// List requests by society and admin
export const listRequests = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get('/requests/list', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error fetching request list:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch request list." };
  }
};


// Add a new visitor log
export const createVisitorLog = async (visitorLogData) => {
  try {

    const response = await api.post('/visitor-logs/create', visitorLogData);

    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error('Create visitor log error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create visitor log.',
    };
  }
};

// Get all visitor logs for the society
export const getVisitorLogs = async () => {
  try {
    const response = await api.get('/visitor-logs/list');
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error('Get visitor logs error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch visitor logs.',
    };
  }
};

// Add a new security protocol
export const addSecurityProtocol = async (protocolData) => {
  try {
    const response = await api.post('/security-protocols/security-protocol', protocolData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error adding security protocol:", error);
    return { success: false, message: error.response?.data?.message || "Failed to add security protocol." };
  }
};

// Update an existing security protocol
export const updateSecurityProtocol = async (id, updatedData) => {
  try {
    const response = await api.put(`/security-protocols/security-protocol/${id}`, updatedData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error updating security protocol:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update security protocol." };
  }
};

// View a specific security protocol
export const viewSecurityProtocol = async (id) => {
  try {
    const response = await api.get(`/security-protocols/security-protocol/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error viewing security protocol:", error);
    return { success: false, message: error.response?.data?.message || "Failed to view security protocol." };
  }
};

// Delete a specific security protocol
export const deleteSecurityProtocol = async (id) => {
  try {
    const response = await api.delete(`/security-protocols/security-protocol/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error deleting security protocol:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete security protocol." };
  }
};

// Fetch all security protocols
export const getSecurityProtocols = async () => {
  try {
    const response = await api.get('/security-protocols/security-protocols');
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Error fetching security protocols:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch security protocols." };
  }
};

// Add Security Guard
export const addSecurityGuard = async (formData) => {
  try {
    const response = await api.post('/security-guards/add', formData, {
      isMultipart: true, // This ensures the correct headers for multipart requests
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Add security guard error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to add security guard." };
  }
};

// Update Security Guard
export const updateSecurityGuard = async (id, formData) => {
  try {
    const response = await api.put(`/security-guards/update/${id}`, formData, {
      isMultipart: true, // This ensures the correct headers for multipart requests
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Update security guard error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update security guard." };
  }
};

// View Security Guard by ID
export const viewSecurityGuard = async (id) => {
  try {
    const response = await api.get(`/security-guards/view/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("View security guard error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch security guard details." };
  }
};

// Delete Security Guard
export const deleteSecurityGuard = async (id) => {
  try {
    const response = await api.delete(`/security-guards/delete/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Delete security guard error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete security guard." };
  }
};

// List All Security Guards
export const listSecurityGuards = async () => {
  try {
    const response = await api.get('/security-guards/list');
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("List security guards error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch security guards." };
  }
};

// Announcement API functions

// Create an announcement
export const createAnnouncement = async (announcementData) => {
  console.log(announcementData);

  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/announcements/create', announcementData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Create announcement error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create announcement." };
  }
};

// Get all announcements
export const getAnnouncements = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/announcements/get', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Get announcements error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch announcements." };
  }
};

// Get a single announcement by ID
export const getAnnouncementDetail = async (id) => {
  try {
    const response = await api.get(`/announcements/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Get announcement error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch the announcement." };
  }
};

// Update an announcement
export const updateAnnouncement = async (id, updatedData) => {
  try {
    const response = await api.put(`/announcements/${id}`, updatedData);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Update announcement error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update announcement." };
  }
};

// Delete an announcement
export const deleteAnnouncement = async (id) => {
  try {
    const response = await api.delete(`/announcements/${id}`);
    return { success: true, message: response.data.message, data: response.data };
  } catch (error) {
    console.error("Delete announcement error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete announcement." };
  }
};

// Resident Management Functions

// Create a new resident
export const createResident = async (residentData) => {
  try {
    const response = await api.post('/residents', residentData, {
      isMultipart: true, // Ensures correct headers for file uploads
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Create resident error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create resident." };
  }
};

// Update an existing resident
export const updateResident = async (id, updateData) => {
  console.log(updateData , "updateData");
  
  try {
    console.log(id,updateData);
    const response = await api.put(`/residents/${id}`, updateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Update resident error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update resident." };
  }
};

// Delete a resident
export const deleteResident = async (id) => {
  try {
    const response = await api.delete(`/residents/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Delete resident error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to delete resident." };
  }
};

// Get all residents
export const getResidents = async () => {
  try {
    const response = await api.get('/residents');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get residents error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch residents." };
  }
};

// Get resident details
export const getResidentDetails = async (id) => {
  try {
    const response = await api.get(`/residents/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get resident details error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch resident details." };
  }
};

// Other Income Management Functions

// Create a new Other Income record
export const createOtherIncome = async (otherIncomeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/other-income/other-income', otherIncomeData, {
      headers: { Authorization: `Bearer ${token}` } // Include the token in the Authorization header
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Create other income error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create other income record." };
  }
};

// Get all Other Income records
export const getOtherIncomes = async () => {
  try {
    const response = await api.get('/other-income/other-income');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get other incomes error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch other income records." };
  }
};

// Get details of a specific Other Income record

export const getOtherIncomeById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get(`/other-income/other-income/${id}`, {
      headers: { Authorization: `Bearer ${token}` } // Include the token in the Authorization header
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get other income by ID error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch other income record." };
  }
};

// Edit an Other Income record
export const editOtherIncome = async (id, updatedData) => {
  console.log(id);

  try {
    const token = localStorage.getItem('token');
    const response = await api.patch(`/other-income/other-income/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` } // Include the token in the Authorization header
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Edit other income error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to update other income record." };
  }
};

// Delete expired Other Income records
// export const deleteExpiredOtherIncome = async () => {
//   try {
//     const response = await api.delete('/other-income/other-income/expired');
//     return { success: true, data: response.data };
//   } catch (error) {
//     console.error("Delete expired other income error:", error);
//     return { success: false, message: error.response?.data?.message || "Failed to delete expired other income records." };
//   }
// };

// Financial Management Functions

// Create a new Financial Income record
export const createFinancialIncome = async (financialIncomeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/financial/financial-income', financialIncomeData, {
      headers: { Authorization: `Bearer ${token}` } // Include the token in the Authorization header
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Create financial income error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to create financial income record." };
  }
};

// Get all Financial Income records
export const getFinancialIncomes = async () => {
  try {
    const response = await api.get('/financial/financial-income');
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get financial incomes error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch financial income records." };
  }
};

// Get payment status for a specific Financial Income record by ID
export const getFinancialIncomeById = async (id) => {
  try {
    const response = await api.get(`/financial/financial-income/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Get financial income by ID error:", error);
    return { success: false, message: error.response?.data?.message || "Failed to fetch financial income record." };
  }
};
