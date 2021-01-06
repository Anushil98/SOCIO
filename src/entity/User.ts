import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserType } from "../types/User.type";

@Entity()
@Unique("email_idx", ["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  UserType: UserType;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  LoginDelay: number;
}