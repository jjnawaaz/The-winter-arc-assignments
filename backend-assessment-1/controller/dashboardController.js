/**
 * Get dashboard statistics for the authenticated user
 *
 * @param userId - ID of the authenticated user
 * @returns - Total workspaces, total tasks, completed tasks, and pending tasks
 * @throws {Error} - If the database query fails
 */
export const getDashboard = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `WITH user_workspaces AS (
        SELECT id
        FROM workspaces
        WHERE user_id = $1
      )
      SELECT
        (SELECT COUNT(*) FROM user_workspaces)::int AS "totalWorkspaces",
        COUNT(t.id)::int AS "totalTasks",
        (COUNT(t.id) FILTER (WHERE t.completed = TRUE))::int AS "completedTasks",
        (COUNT(t.id) FILTER (WHERE t.completed = FALSE))::int AS "pendingTasks"
      FROM user_workspaces uw
      LEFT JOIN tasks t ON t.workspace_id = uw.id`,
      [Number(userId)],
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    throw err;
  }
};
