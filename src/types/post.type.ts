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
