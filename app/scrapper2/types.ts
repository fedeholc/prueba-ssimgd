
export type Page = {
  url: string;
  images: string[];
};

export type Source = {
  name: string;
  url: string;
  pages: Page[];
};