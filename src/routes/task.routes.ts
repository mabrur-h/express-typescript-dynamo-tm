import {Router} from "express"
import validateErrorMiddleware from "../middleware/validate-error.middleware";
import {TaskController} from "../controller/task.controller";
import authMiddleware from "../middleware/auth.middleware";
import CreateTaskSchema from "../schema/task/create-task.schema";

class TasksRoute {
  public path = '/tasks'
  public router = Router()
  public taskController = new TaskController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.use(authMiddleware)
    this.router.post(`${this.path}/create`, validateErrorMiddleware(CreateTaskSchema), this.taskController.taskCreate);
    this.router.put(`${this.path}/edit/:taskId`, validateErrorMiddleware(CreateTaskSchema), this.taskController.taskEdit);
    this.router.get(`${this.path}`, this.taskController.taskGetByUser);
    this.router.get(`${this.path}/search`, this.taskController.taskSearchByTitle);
    this.router.get(`${this.path}/:taskId`, this.taskController.taskGetById);
    this.router.delete(`${this.path}/delete/:taskId`, this.taskController.taskDeleteById);
  }
}

export default TasksRoute