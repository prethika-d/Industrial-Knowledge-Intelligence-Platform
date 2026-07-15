export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const saveAuth = (data) => {
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};