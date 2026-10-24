import { pool } from "../db.js";
import { taskSchema, updateTaskSchema } from "../types/types.js";

/**
 * Create a new task in the specified workspace
 *
 * @param req - Request containing task details in the body and workspace ID in the headers
 * @param res - Response containing the newly created task
 * @returns - The created task with a success message
 * @throws {Error} - If the database query fails
 */
export const createTask = async (req, res) => {
  const workspaceId = Number(req.headers.workspaceid);

  const data = taskSchema.safeParse(req.body);

  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message,
    });
  }

  if (!workspaceId) {
    return res.status(400).json({
      message: "Please send the workspace Id",
    });
  }

  const { title, description, dueDate } = data.data;
  const completed = false;

  try {
    const tasks = await pool.query(
      `INSERT INTO tasks (
        title,
        description,
        completed,
        workspace_id,
        due_date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, completed,
                workspace_id, due_date AS "dueDate"`,
      [title, description, completed, Number(workspaceId), dueDate],
    );

    return res.status(201).json({
      message: "Task created successfully",
      task: tasks.rows[0],
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Retrieve tasks from the specified workspace with pagination and search
 *
 * @param req - Request containing the workspace ID, search query, page, and limit
 * @param res - Response containing the retrieved tasks and pagination details
 * @returns - The list of tasks matching the search criteria and pagination settings
 * @throws {Error} - If the database query fails
 */
export const getTasks = async (req, res) => {
  const userId = Number(req.user.id);
  const workspaceId = Number(req.headers.workspaceid);

  const search = req.query.search?.trim() || "";

  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
  );

  const offset = (page - 1) * limit;

  try {
    const tasks = await pool.query(
      `SELECT *
       FROM tasks
       WHERE workspace_id = $1
         AND workspace_id IN (
           SELECT id
           FROM workspaces
           WHERE user_id = $2
         )
         AND (
           $3 = ''
           OR title ILIKE $3
           OR description ILIKE $3
         )
       ORDER BY id
       LIMIT $4 OFFSET $5`,
      [Number(workspaceId), Number(userId), `%${search}%`, limit, offset],
    );

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      pagination: {
        page,
        limit,
        count: tasks.rowCount,
      },
      tasks: tasks.rows,
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Update the completion status of a task
 *
 * @param req - Request containing the task ID, workspace ID, authenticated user, and updated completion status
 * @param res - Response containing the updated task
 * @returns - The updated task with a success message
 * @throws {Error} - If the database query fails
 */
export const patchTask = async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = Number(req.user.id);
  const workspaceId = Number(req.headers.workspaceid);
  const data = updateTaskSchema.safeParse(req.body);
  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message,
    });
  }
  // patch
  try {
    const task = await pool.query(
      `UPDATE tasks SET completed = $1 where id = $2 AND workspace_id = $3 AND workspace_id IN ( SELECT id FROM workspaces WHERE user_id = $4) RETURNING *;`,
      [data.data.completed, taskId, workspaceId, userId],
    );
    if (task.rowCount === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    return res.status(200).json({
      message: "Task updated successfully",
      task: task.rows[0],
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Delete a task from the specified workspace
 *
 * @param req - Request containing the task ID, workspace ID, and authenticated user
 * @param res - Response containing the deleted task
 * @returns - The deleted task with a success message
 * @throws {Error} - If the database query fails
 */
export const deleteTask = async (req, res) => {
  const taskId = Number(req.params.id);
  const userId = Number(req.user.id);
  const workspaceId = Number(req.headers.workspaceid);
  try {
    const task = await pool.query(
      `DELETE FROM tasks
        WHERE id = $1
        AND workspace_id = $2
        AND workspace_id IN (
            SELECT id
            FROM workspaces
            WHERE user_id = $3
        )
        RETURNING *;`,
      [taskId, workspaceId, userId],
    );
    if (task.rowCount === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      task: task.rows[0],
    });
  } catch (err) {
    throw err;
  }
};
