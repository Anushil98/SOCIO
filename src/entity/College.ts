import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("college")
export class College {
  @PrimaryGeneratedColumn("uuid")
  collegeId: string;

  @OneToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("uuid")
  userId: string;

  @Column()
  collegeName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  bio: string;
}
