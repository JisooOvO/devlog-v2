import apiResponse from "@/lib/types/apiResponse";

const checkAuth = async (email: string | undefined | null) => {
  if (!email) return false;

  let authEmails = process.env.GITHUB_EMAILS?.split(",");

  if (!authEmails) {
    const response = await fetch("/api/auth/users");
    const jsonData = (await response.json()) as apiResponse;
    authEmails = jsonData.data;
  }

  return authEmails?.includes(email);
};

export default checkAuth;
