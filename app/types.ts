/* eslint-disable @typescript-eslint/no-unused-vars */

type Page = {
  url: string;
  images: string[];
};

type Source = {
  _id: string;
  name: string;
  url: string;
  pages: Page[];
};

type SourceId = Pick<Source, "_id">;
type SourceName = Pick<Source, "name">;

type Action = { type: "add"; payload: Page } | { type: "reset-pages" } | { type: "load"; payload: Source };

type OneSourceAction = { type: "add"; payload: Page } | { type: "reset-pages" } | { type: "load"; payload: Source } | { type: "update"; payload: Source };

type SourceListItem = {
  _id: string;
  name: string;
}

type SourceListAction = { type: "add"; payload: SourceListItem } | { type: "load"; payload: SourceListItem[] } | { type: "remove", payload: string } | { type: "update"; payload: SourceListItem };
