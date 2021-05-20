import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity("search")
export class Search {
  @PrimaryGeneratedColumn("uuid")
  searchId: string;

  @ManyToOne(
    () => User,
    user => user.id,
    { onDelete: "CASCADE", nullable: true }
  )
  @JoinColumn({ name: "userId" })
  User?: User;

  @Column("uuid", { nullable: true })
  userId: string;

  @ManyToOne(
    () => Group,
    group => group.grpId,
    { onDelete: "CASCADE", nullable: true }
  )
  @JoinColumn({ name: "grpId" })
  Group?: Group;

  @Column("uuid", { nullable: true })
  grpId: string;

  @Column("text")
  searchText: string;

  @Column("int", { default: 0 })
  score: number;
}
