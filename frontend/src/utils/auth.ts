// src/utils/auth.ts
export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return parseInt(payload.sub); // assuming user_id is in "sub"
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};
