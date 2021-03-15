import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserType } from "../types/User.type";
import { College } from "./College";
import { Student } from "./Student";

@Entity()
@Unique("email_idx", ["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  UserType: UserType;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  FalseLoginAttempts: number;

  @Column({ default: 0 })
  LoginDelay: number;

  @Column({ nullable: true })
  LastLoginTime: Date;

  @OneToOne(
    () => Student,
    student => student.studentId
  )
  @JoinColumn({ name: "studentId" })
  Student: Student;

  @Column({ nullable: true })
  studentId: string;

  @OneToOne(
    () => College,
    college => college.collegeId
  )
  @JoinColumn({ name: "collegeId" })
  College: College;

  @Column({ nullable: true })
  collegeId: string;
}
