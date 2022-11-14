import {NextFunction, Request, Response} from 'express'
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";
import {TaskDto} from "../dto/task.dto";
import {TaskService} from "../service/task.service";

export class TaskController {
  public taskService = new TaskService()

  public taskCreate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: TaskDto = req.body
      const userId = res.locals.user.PK

      if (!userId)
        throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User not found")

      await this.taskService.createTask(userId, taskData)

      res.status(201).json({
        message: "Task created successfully!"
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }
  public taskEdit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const taskData: TaskDto = req.body
      const taskId = req.params.taskId
      const userId = res.locals.user.PK

      if (!userId)
        throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User not found")

      await this.taskService.editTask(userId, taskData, taskId)

      res.status(201).json({
        message: "Task updated successfully!"
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }
  public taskGetById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {PK} = res.locals.user
      const taskId = req.params.taskId;
      const task = await this.taskService.getTaskById(PK, taskId)
      if (!task)
        throw new HttpException(404, ErrorsEnum.BAD_REQUEST_ERROR, 'Task not exists')

      res.status(200).json({
        task
      })
    } catch (e) {
      next(e)
    }
  }
  public taskGetByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {PK} = res.locals.user
      const tasks = await this.taskService.getTasks(PK)

      res.status(200).json({
        tasks
      })
    } catch (e) {
      next(e)
    }
  }
  public taskSearchByTitle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {PK} = res.locals.user
      console.log(req.query)
      const {title} = req.query
      if (!title)
        throw new HttpException(400, ErrorsEnum.BAD_INPUT_ERROR, "Query should contain title")

      const tasks = await this.taskService.getTasksByTitle(title, PK)

      res.status(200).json({
        tasks
      })
    } catch (e) {
      next(e)
    }
  }
  public taskDeleteById  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {PK} = res.locals.user
      const {taskId} = req.params
      if (!taskId)
        throw new HttpException(404, ErrorsEnum.BAD_INPUT_ERROR, "Task id not found")

      const task = await this.taskService.getTaskById(PK, taskId)

      if (!task)
        throw new HttpException(404, ErrorsEnum.BAD_INPUT_ERROR, "Task not found")

      if (task.PK !== PK)
        throw new HttpException(403, ErrorsEnum.FORBIDDEN_ERROR, "Task not belongs to you")

      await this.taskService.deleteTaskById(PK, taskId)

      res.status(200).json({
        message: "Task deleted successfully!"
      })
    } catch (e) {
      next(e)
    }
  }
}