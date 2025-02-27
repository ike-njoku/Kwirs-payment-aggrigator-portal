import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const authenticateUser = () => {
  console.table({ MESSAGE: "AUTHENTICATING" });
  const authenticatedUser = JSON.parse(localStorage.getItem("authDetails"));
  if (!authenticatedUser) {
    toast.error("You are not Logged in");
    window.localStorage.clear();
    const router = useRouter();
    router.push("/login");
    return false;
  }

  return authenticatedUser;
};
