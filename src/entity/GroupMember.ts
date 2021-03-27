import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MemberType } from "../types/Group.type";
import { Group } from "./Group";
import { Invite } from "./Invite";
import { User } from "./User";

@Entity("GroupMember")
export class GroupMember {
  @PrimaryGeneratedColumn("uuid")
  memberId: string;

  @Column({ type: "enum", enum: MemberType })
  MemberType: MemberType;

  @ManyToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "userId" })
  User: User;

  @Column("uuid")
  userId: string;

  @ManyToOne(
    () => Group,
    group => group.grpId
  )
  @JoinColumn({ name: "grpId" })
  Group: Group;

  @Column("uuid")
  grpId: string;

  @ManyToOne(
    () => Invite,
    invite => invite.InviteId
  )
  @JoinColumn({ name: "inviteId" })
  Invite: Invite;

  @Column("uuid", { nullable: true })
  inviteId: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
