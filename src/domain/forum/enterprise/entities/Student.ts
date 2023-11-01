import { Entity } from '@/core/entities/Entity';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export interface StudentProps {
  name: string;
  email: string;
  password: string;
}

export class Student extends Entity<StudentProps> {
  get name(): string { return this.props.name; }

  get email(): string { return this.props.email; }

  get password(): string { return this.props.password; }

  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id);

    return student;
  }
}
