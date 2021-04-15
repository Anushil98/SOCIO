import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "../types/post.type";
import { Group } from "./Group";
import { PostTag } from "./PostTag";
import { User } from "./User";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn("uuid")
  postId: string;

  @ManyToOne(
    () => Group,
    group => group.grpId,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "grpId" })
  Group: Group;

  @Column("uuid", { nullable: true })
  grpId: string;

  @ManyToOne(
    () => Post,
    post => post.postId,
    {
      onDelete: "CASCADE"
    }
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
    user => user.id,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "userId" })
  User: User;

  @Column("uuid")
  userId: string;

  @Column("text", { nullable: true })
  text: string;

  @Column("jsonb", { array: true, nullable: true })
  Media: Media[];

  @OneToMany(
    () => PostTag,
    postTag => postTag.Post
  )
  postTags: PostTag[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
