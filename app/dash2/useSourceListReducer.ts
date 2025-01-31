import { useReducer } from 'react';
import { useCallback } from 'react';
import sourceListReducer from './sourceListReducer';

export function useSourceListReducer() {
  const [sourceList, dispatch] = useReducer(sourceListReducer, []);

  const actions: SourceListReducerActions = {
    load: useCallback((sources: SourceListItem[]) => {
      dispatch({ type: 'load', payload: sources });
    }, []),

    add: useCallback((source: SourceListItem) => {
      dispatch({ type: 'add', payload: source });
    }, []),

    update: useCallback((source: SourceListItem) => {
      dispatch({ type: 'update', payload: source });
    }, []),

    remove: useCallback((id: string) => {
      dispatch({ type: 'remove', payload: id });
    }, [])
  };

  return {
    sourceList,
    actions
  };
}