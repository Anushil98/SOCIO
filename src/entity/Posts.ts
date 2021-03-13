import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "../types/post.type";
import { User } from "./User";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  postId: string;

  @ManyToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  User: User;

  @Column("uuid")
  userId: string;

  @Column("text", { nullable: true })
  text: string;

  @Column("jsonb", { array: true, nullable: true })
  Media: Media[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
