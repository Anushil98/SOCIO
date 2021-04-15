export interface Media {
  filename: string;
  baseurl: string;
}

export interface PostInput {
  parentId?: string;
  grpId?: string;
  text: string;
  Media: Media[];
}
export interface TagInput {
  tagName: string;
  tagId: string;
}
export enum PostType {
  public = "Public",
  private = "Private"
}
