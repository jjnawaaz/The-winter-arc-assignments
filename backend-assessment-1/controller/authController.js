import { pool } from "../db.js";
import { SigninSchema, SignupSchema } from "../types/types.js";
import { hashPassword, verifyPassword } from "../utils/bcrptUtils.js";
import { createJWT } from "../utils/jwtUtils.js";

/**
 * Register a new user
 *
 * @param req - Request containing the username and password in the body
 * @param res - Response containing the newly created user
 * @returns - The created user with a success message
 * @throws {Error} - If password hashing or the database query fails
 */
export async function signupUser(req, res) {
  // Validate the received data using Zod
  const data = SignupSchema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message,
    });
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await hashPassword(data.data.password);

    // Create the user
    const user = await pool.query(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username`,
      [data.data.username, hashedPassword],
    );

    return res.status(201).json({
      message: "User created successfully",
      user: user.rows[0],
    });
  } catch (err) {
    // Handle duplicate usernames
    if (err instanceof Error && err.code === "23505") {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    throw err;
  }
}

/**
 * Authenticate an existing user
 *
 * @param req - Request containing the username and password in the body
 * @param res - Response containing the authentication token
 * @returns - A JWT if authentication succeeds
 * @throws {Error} - If password verification or the database query fails
 */
export async function signinUser(req, res) {
  // Validate the received data using Zod
  const data = SigninSchema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message,
    });
  }

  // Find the user by username
  const user = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    data.data.username,
  ]);

  // Return the same error for an unknown username or incorrect password
  if (user.rowCount === 0) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Verify the submitted password against the stored password hash
  const isPasswordValid = await verifyPassword(
    data.data.password,
    user.rows[0].password,
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Create a JWT containing the authenticated user's ID
  const token = createJWT({
    id: user.rows[0].id,
  });

  return res.status(200).json({
    message: "User successfully signed in",
    token,
  });
}
