import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../types/User.type";
import { User } from "./User";

@Entity("student")
@Check(`"age" < 100 AND "age" > 0`)
export class Student {
  @PrimaryGeneratedColumn("uuid")
  studentId: string;

  @OneToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("uuid")
  userId: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  gender: Gender;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  age: number;
}
