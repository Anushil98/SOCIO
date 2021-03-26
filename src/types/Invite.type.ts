export enum InviteStateEnum {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Pending = "Pending"
}

export interface InviteInput {
  hostId: string;
  guestId: string;
}
