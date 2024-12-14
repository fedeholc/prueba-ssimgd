


export const ADD_PAGE = 'ADD_PAGE';

type AddPageAction = {
  type: typeof ADD_PAGE;
  payload: Page;
};

export type ScrapperAction = AddPageAction;

export const addPage = (page: Page): AddPageAction => ({
  type: ADD_PAGE,
  payload: page
});