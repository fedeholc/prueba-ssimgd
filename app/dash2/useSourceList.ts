import { useEffect, useReducer } from 'react';
import sourceListReducer from './sourceListReducer';
import { useFetchSourceList } from './useFetchSourceList';

export function useSourceList() {
  const { data: sourceListData, isLoading, isDone, error  } = useFetchSourceList();
  const [sourceList, dispatch] = useReducer(sourceListReducer, sourceListData);

  useEffect(() => {
    if (sourceListData && sourceListData.length > 0) {
      dispatch({ type: 'load', payload: sourceListData });
    }
  }, [sourceListData]);
    

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
    actions, isLoading, isDone, error
  };
}