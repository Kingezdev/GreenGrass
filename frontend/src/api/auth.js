import apiClient from "./apiClient";

export const loginUser = async (email, password) => {
  try {
    // Get JWT token
    const response = await apiClient.post("/api/token/", { email, password });
    const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Fetch user profile
    const profileRes = await apiClient.get("/api/accounts/profile/");
    return profileRes.data.data; // user object
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
