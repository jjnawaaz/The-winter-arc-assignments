import { pool } from "../db.js";
import { workspaceSchema } from "../types/types.js";
/**
 * Create a new workspace for the authenticated user
 *
 * @param req - Request containing the workspace name in the body and authenticated user information
 * @param res - Response containing the newly created workspace
 * @returns - The created workspace with a success message
 * @throws {Error} - If the database query fails
 */
export const createWorkSpace = async (req, res) => {
  // workspace name validation
  const data = workspaceSchema.safeParse(req.body);
  // get userId
  const userId = req.user.id;
  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message,
    });
  }

  try {
    // create a workspace
    const workspace = await pool.query(
      `INSERT INTO workspaces (name, user_id) VALUES ($1, $2) RETURNING id, name, user_id`,
      [data.data.name, userId],
    );
    return res.status(201).json({
      message: "Workspace created successfully",
      workspace: workspace.rows[0],
    });
  } catch (err) {
    throw err;
  }
};
/**
 * Retrieve workspaces from the database
 *
 * @param req - Request containing authenticated user information
 * @param res - Response containing the retrieved workspaces
 * @returns - The list of workspaces with a success message
 * @throws {Error} - If the database query fails
 */
export const getAllWorkSpaces = async (req, res) => {
  const userId = Number(req.user.id);
  try {
    const data = await pool.query(
      `SELECT * from workspaces WHERE user_id = $1`,
      [userId],
    );
    return res.status(200).json({
      message: "Workspaces fetched successfully",
      workspaces: data.rows,
    });
  } catch (err) {
    throw err;
  }
};
/**
 * Delete a workspace belonging to the authenticated user
 *
 * @param req - Request containing the workspace ID in the route parameters and authenticated user information
 * @param res - Response indicating whether the workspace was deleted successfully
 * @returns - A success message if the workspace is deleted, or an error if no matching workspace is found
 * @throws {Error} - If the database query fails
 */
export const deleteWorkSpaces = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    // user should delete their own id made workspaces and not others
    const data = await pool.query(
      `DELETE from workspaces where id = $1 and user_id = $2`,
      [id, Number(userId)],
    );
    if (data.rowCount === 0) {
      return res.status(403).json({
        message: "Workspace not found",
      });
    }
    return res.status(200).json({
      message: "Workspace deleted successfully",
    });
  } catch (err) {
    throw err;
  }
};
