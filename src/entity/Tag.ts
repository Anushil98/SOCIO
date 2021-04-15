import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("tag")
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  tagId: string;

  @Column("character varying", { unique: true, length: 20 })
  tagName: string;

  @ManyToOne(
    () => User,
    user => user.id,
    {
      onDelete: "SET NULL"
    }
  )
  @JoinColumn({ name: "createdBy" })
  User: User;

  @Column("uuid")
  createdBy: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
