import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../types/User.type";
import { User } from "./User";

@Entity("student")
@Check(`"age" < 100 AND "age" > 0`)
export class Student {
  @PrimaryGeneratedColumn()
  studentId: number;

  @OneToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  gender: Gender;

  @Column()
  avatar: string;

  @Column()
  cover: string;

  @Column()
  bio: string;

  @Column()
  age: number;
}
