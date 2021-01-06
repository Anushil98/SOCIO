import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserType } from "../types/User.type";
import { College } from "./College";
import { Student } from "./Student";

@Entity()
@Unique("email_idx", ["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  UserType: UserType;

  @Column()
  email: string;

  @Column({ default: 0 })
  LoginDelay: number;

  @OneToOne(
    () => Student,
    student => student.studentId,
    { nullable: true }
  )
  @JoinColumn({ name: "studentId" })
  student: Student;

  @Column({ nullable: true })
  studentId: number;

  @OneToOne(
    () => College,
    college => college.collegeId,
    { nullable: true }
  )
  @JoinColumn({ name: "collegeId" })
  college: College;

  @Column({ nullable: true })
  collegeId: number;
}
