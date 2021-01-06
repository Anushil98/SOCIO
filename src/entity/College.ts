import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("college")
export class College {
  @PrimaryGeneratedColumn()
  collegeId: number;

  @OneToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @Column()
  collegeName: string;

  @Column()
  avatar: string;

  @Column()
  cover: string;

  @Column()
  bio: string;
}
