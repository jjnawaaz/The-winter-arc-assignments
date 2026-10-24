import jwt from "jsonwebtoken";

/**
 * Create a JSON Web Token for a user
 *
 * @param payload - Data to encode in the token, such as the authenticated user's ID
 * @returns - A signed JWT that expires after 2 hours
 * @throws {Error} - If the JWT secret is missing or token signing fails
 */
export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  return token;
};

/**
 * Verify a JSON Web Token and retrieve its payload
 *
 * @param token - JWT to verify
 * @returns - The decoded payload if the token is valid
 * @throws {Error} - If the token is invalid, expired, or verification fails
 */
export const verifyJWT = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  return payload;
};
