const checkAuth = async (email: string | undefined | null) => {
  if (!email) return false;

  let authEmails = process.env.GITHUB_EMAILS?.split(",");

  if (!authEmails) {
    const response = await fetch("/api/auth/user");
    const jsonData = await response.json();
    authEmails = jsonData["user"];
  }

  return authEmails?.includes(email);
};

export default checkAuth;
