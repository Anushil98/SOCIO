import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity("group")
export class Group {
  @PrimaryGeneratedColumn("uuid")
  grpId: string;

  @ManyToOne(
    () => User,
    user => user.id
  )
  @JoinColumn({ name: "ownerId" })
  Owner: User;

  @Column()
  ownerId: string;

  @Column()
  grpName: string;

  @Column({ unique: true })
  grpHandle: string;

  @Column("text")
  grpBio: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
