import {
  createTask, deleteTaskById, editTask, getTaskById, getTasks, getTasksByTitle
} from "../model/task.model";
import {TaskDto} from "../dto/task.dto";

export class TaskService {
  public async createTask(userId: string, taskData: TaskDto) {
    return await createTask(userId, taskData);
  }
  public async editTask(userId: string, taskData: TaskDto, taskId: string) {
    return await editTask(userId, taskData, taskId)
  }
  public async getTaskById(userId: string, taskId: string) {
    return await getTaskById(userId, taskId)
  }
  public async getTasks(userId: string) {
    return await getTasks(userId)
  }
  public async getTasksByTitle(title: any, userId: string) {
    return await getTasksByTitle(title, userId)
  }
  public async deleteTaskById(userId: string, taskId: string) {
    return await deleteTaskById(userId, taskId)
  }
}