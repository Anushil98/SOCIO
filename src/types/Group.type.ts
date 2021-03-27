export interface GroupInput {
  grpName: string;
  grpHandle: string;
  grpBio?: string;
  ownerId?: string;
}

export enum MemberType {
  Owner = "Owner",
  Member = "Member"
}
