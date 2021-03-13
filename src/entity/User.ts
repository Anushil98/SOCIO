import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserType } from "../types/User.type";

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
}
