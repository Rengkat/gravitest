import { Injectable } from '@nestjs/common';
import { HashProvider } from 'src/common/hash/providers/Hash.provider';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    private readonly hashProvider: HashProvider,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}
  // This provider can be used to create users with realted tables.
  // It can handle both students and tutors, and will use transaction to create other relate table atomic.
  // The generated passwords can be returned in the response so that they can be communicated to the users.
  // The provider will also handle validation, such as checking for duplicate emails or phone numbers, and will return a summary of the results (e.g. how many users were created, how many were skipped due to duplicates, etc.).
  // The provider can be injected into a controller or service where it can be called with the appropriate DTO containing the user data to be created.
}
