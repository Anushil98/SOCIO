import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "../types/post.type";
import { User } from "./User";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  postId: string;

  @ManyToOne(
    () => Post,
    post => post.postId
  )
  @JoinColumn({ name: "parentId" })
  Parent: Post;

  @Column({ default: null, nullable: true })
  parentId: string;

  @Column("boolean", { default: false })
  HasChildren: boolean;

  @OneToMany(
    () => Post,
    post => post.Parent
  )
  children: Post[];

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
