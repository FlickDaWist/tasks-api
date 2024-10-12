import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(createTaskDto: CreateTaskDto, userId) {
    const result = await this.tasksRepository.save({
      ...createTaskDto,
      user: { id: userId },
    });
    return result;
  }

  findAll(userId) {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId) {
    const result = await this.tasksRepository.findOne({
      where: { user: { id: userId }, id },
    });

    if (!result) {
      throw new BadRequestException('task not found');
    }
    return result;
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
    return await this.tasksRepository.delete({ id: old.id });
  }
}
