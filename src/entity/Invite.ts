import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InviteStateEnum } from "../types/Invite.type";
import { Group } from "./Group";
import { User } from "./User";

@Entity("Invite")
export class Invite {
  @PrimaryGeneratedColumn("uuid")
  InviteId: string;

  @ManyToOne(
    () => User,
    user => user.id,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "hostId" })
  Host: User;

  @Column("uuid")
  hostId: string;

  @ManyToOne(
    () => User,
    user => user.id,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "guestId" })
  Guest: User;

  @Column("uuid")
  guestId: string;

  @ManyToOne(
    () => Group,
    group => group.grpId,
    {
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "grpId" })
  Group: Group;

  @Column("uuid")
  grpId: string;

  @Column("enum", { enum: InviteStateEnum, default: InviteStateEnum.Pending })
  InviteState: InviteStateEnum;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
