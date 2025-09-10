// api/accounts.js
const API_BASE = "https://greengrass-backend.onrender.com/api/accounts";

export const getMyProfile = async (token) => {
  const res = await fetch(`${API_BASE}/profile/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

export const getProfileByUsername = async (username, token) => {
  const res = await fetch(`${API_BASE}/profile/${username}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // Throw an error with the actual status code
    const error = new Error("Failed to fetch user profile");
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const getLandlords = async () => {
  const res = await fetch(`${API_BASE}/landlords/`);
  if (!res.ok) throw new Error("Failed to fetch landlords");
  return res.json();
};
