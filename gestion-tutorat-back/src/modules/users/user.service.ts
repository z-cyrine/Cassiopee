import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async createUser(data: createUserDto): Promise<User> {
    const existing = await this.repo.findOneBy({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updates);
    return this.repo.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async searchByEmail(email: string): Promise<User[]> {
    return this.repo.find({
      where: { email: ILike(`%${email}%`) }, // Case-insensitive LIKE
    });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.repo.findOne({ where: { username } });
  }

  async advancedSearch({ name, email, role }: { name?: string; email?: string; role?: string }): Promise<User[]> {
    const where: any = {};
    if (name) where.name = ILike(`%${name}%`);
    if (email) where.email = ILike(`%${email}%`);
    if (role) where.role = role;
    return this.repo.find({ where });
  }

}
