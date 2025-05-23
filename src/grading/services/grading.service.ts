import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../entities/grade-entity';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class GradingService {
  createGrade(
    arg0: number,
    arg1: { grade: number; feedback: string },
    arg2: any,
  ) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
  ) {}

  async gradeAssignment(
    mentor: User,
    studentId: number,
    assignmentId: number,
    dto: CreateGradeDto,
  ) {
    const grade = this.gradeRepository.create({
      mentor,
      student: { id: studentId } as any,
      assignment: { id: assignmentId } as any,
      numericGrade: dto.numericGrade,
      feedback: dto.feedback,
    });
    return this.gradeRepository.save(grade);
  }

  async updateGrade(mentor: User, gradeId: number, dto: UpdateGradeDto) {
    const grade = await this.gradeRepository.findOne({
      where: { id: gradeId },
      relations: ['mentor'],
    });
    if (!grade) throw new NotFoundException('Grade not found.');
    if (grade.mentor.id !== mentor.id)
      throw new ForbiddenException('You cannot update this grade.');

    Object.assign(grade, dto);
    return this.gradeRepository.save(grade);
  }

  async getGradingHistory(mentor: User) {
    return this.gradeRepository.find({
      where: { mentor: { id: mentor.id } },
      relations: ['student', 'assignment'],
    });
  }
}
