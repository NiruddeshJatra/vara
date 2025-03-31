export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email address is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return null;
};

export const validateUsername = (username: string) => {
  if (!username) return "Username is required";
  if (username.length > 150) return "Username must be less than 150 characters";
  return null;
};

export const validatePassword = (
  password: string,
  confirmPassword?: string
) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password))
    return "Password must contain both letters and numbers";

  if (confirmPassword && password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

export const validateTermsAgreed = (termsAgreed: boolean) => {
  if (!termsAgreed) return "You must agree to the Terms of Service";
  return null;
};
