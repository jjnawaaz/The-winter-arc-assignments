import { verifyJWT } from "../utils/jwtUtils.js";

/**
 * Authenticate requests using a JWT
 *
 * @param req - Express request containing the authorization header
 * @param res - Express response used to return authentication errors
 * @param next - Function that passes control to the next middleware or route handler
 * @returns - Calls next() if authentication succeeds, otherwise returns an error response
 * @throws {Error} - If JWT verification throws an unexpected error
 */
export const authMiddleware = (req, res, next) => {
  // get the token from the asuthorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  // verify the token
  const data = verifyJWT(token);

  if (!data) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  // set authenticated user information to the request
  req.user = data;

  // next route
  next();
};
