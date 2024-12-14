type Page = {
  url: string;
  images: string[];
};

type Source = {
  _id?: string;
  name: string;
  url: string;
  pages: Page[];
};

type Action = { type: "add"; payload: Page } | { type: "reset-pages" } | { type: "load"; payload: Source };

type OneSourceAction = { type: "add"; payload: Page } | { type: "reset-pages" } | { type: "load"; payload: Source } | { type: "update"; payload: Source };

type SourceListAction = { type: "add"; payload: Source } | { type: "load"; payload: Source[] } | { type: "remove", payload: string } | { type: "update"; payload: Source };
