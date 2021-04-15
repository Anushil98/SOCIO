import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Posts";
import { Tag } from "./Tag";

@Entity("PostTag")
export class PostTag {
  @PrimaryGeneratedColumn("uuid")
  postTagId: string;

  @ManyToOne(
    () => Post,
    post => post.postId,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "postId" })
  Post: Post;

  @Column("uuid")
  postId: string;

  @ManyToOne(
    () => Tag,
    tag => tag.tagId,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "tagId" })
  Tag: Tag;

  @Column("uuid")
  tagId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
