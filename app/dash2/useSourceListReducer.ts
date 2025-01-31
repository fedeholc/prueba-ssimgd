import { useReducer } from 'react';
import sourceListReducer from './sourceListReducer';

export function useSourceListReducer() {
  const [sourceList, dispatch] = useReducer(sourceListReducer, []);

  const actions: SourceListReducerActions = {
    load: (sources: SourceListItem[]) => {
      dispatch({ type: 'load', payload: sources });
    },
    add: (item: SourceListItem) => {
      dispatch({ type: 'add', payload: item });
    },
    update: (item: SourceListItem) => {
      dispatch({ type: 'update', payload: item });
    },
    remove: (id: string) => {
      dispatch({ type: 'remove', payload: id });
    }
  };

  return {
    sourceList,
    actions
  };
}