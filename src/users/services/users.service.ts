import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';

@Injectable()
export class UsersService {
  private readonly users: Record<string, User>;

  constructor() {
    this.users = {
      VitaliiBaryliuk1: {
        name: 'VitaliiBaryliuk1',
        id: 'f13be0a2-ea9a-407f-a052-20764f9ce444'
      },
    }
  }

  findOne(userId: string): User {
    return this.users[ userId ];
  }

  createOne({ name, password }: User): User {
    const id = v4(v4());
    const newUser = { id: name || id, name, password };

    this.users[ id ] = newUser;

    return newUser;
  }

}
