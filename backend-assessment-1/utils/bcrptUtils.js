import bcrypt from "bcrypt";

/**
 * Hash a user's password
 *
 * @param password - Plain-text password to hash
 * @returns - The hashed password
 * @throws {Error} - If password hashing fails
 */
export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

/**
 * Verify a password against its stored hash
 *
 * @param password - Plain-text password to verify
 * @param hashedPassword - Previously hashed password stored in the database
 * @returns - True if the password matches the hash, otherwise false
 * @throws {Error} - If password comparison fails
 */
export const verifyPassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};
