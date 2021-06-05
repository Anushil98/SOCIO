import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserType } from "../types/User.type";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  UserType: UserType;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  FalseLoginAttempts: number;

  @Column({ default: 0 })
  LoginDelay: number;

  @Column({ nullable: true })
  LastLoginTime: Date;

  @Column({ unique: true })
  username: string;

  @Column()
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ select: false, nullable: true })
  ismember?: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
