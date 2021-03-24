export interface Media {
  filename: string;
  baseurl: string;
}

export interface PostInput {
  parentId?: string;
  text: string;
  Media: Media[];
}
