import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FollowStatus } from "../types/UserFollow";
import { User } from "./User";

@Index(["followerId", "followingId"], { unique: true })
@Entity("userFollow")
class UserFollow {
  @PrimaryGeneratedColumn("uuid")
  userfollowId: string;

  @ManyToOne(
    () => User,
    user => user.id
  )
  @JoinColumn([{ name: "followerId" }])
  follower: User;

  @ManyToOne(
    () => User,
    user => user.id
  )
  @JoinColumn([{ name: "followingId" }])
  following: User;

  @Column()
  followerId: string;

  @Column()
  followingId: string;

  @Column("text", { default: "Resolved" })
  followStatus: FollowStatus;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

export default UserFollow;
