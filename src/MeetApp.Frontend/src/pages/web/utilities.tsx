import { useAuthUser } from "react-auth-kit";

export const loadUserFromSession = () => {
  const userData = sessionStorage.getItem("user");
  if (userData) return JSON.parse(userData);
  else return useAuthUser()()?.user;
};
