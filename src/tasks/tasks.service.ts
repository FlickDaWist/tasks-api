import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const result = await this.tasksRepository.save(createTaskDto);
    return result;
  }

  findAll(userId) {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
    });
  }

  findOne(id: number, userId) {
    return this.tasksRepository.findOne({
      where: { user: { id: userId }, id },
    });
  }

  async update(id: number, userId, updateTaskDto: UpdateTaskDto) {
    const old = await this.findOne(id, userId);

    updateTaskDto.description && (old.description = updateTaskDto.description);
    updateTaskDto.name && (old.name = updateTaskDto.name);
    updateTaskDto.dueDate && (old.dueDate = updateTaskDto.dueDate);
    updateTaskDto.isDone && (old.isDone = updateTaskDto.isDone);

    return await this.tasksRepository.save(old);
  }

  async remove(id: number, userId) {
    const old = await this.findOne(id, userId);
    return await this.tasksRepository.delete(old);
  }
}
