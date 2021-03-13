export interface Media {
  filename: string;
  baseurl: string;
}

export interface PostInput {
  text: string;
  Media: Media[];
}
