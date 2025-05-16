import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import { Repository } from 'typeorm';
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


    
  // créer un utilisateur avec mot de passe hashé
  // async createUser(email: string, plainPassword: string, name: string) {
  //   const existing = await this.repo.findOneBy({ email });
    
  //   if (existing) throw new Error('Email already in use');

  //   const saltRounds = 10;
  //   const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  //   const newUser = this.repo.create({
  //     email,
  //     password: hashedPassword,
  //     name,
  //   });

  //   return this.repo.save(newUser);
  // }
  // user.service.ts
  async createUser(data: createUserDto): Promise<User> {
    const existing = await this.repo.findOneBy({ email: data.email });
    if (existing) throw new Error('Email already in use');

    const user = this.repo.create(data);
    return this.repo.save(user);
  }



}
