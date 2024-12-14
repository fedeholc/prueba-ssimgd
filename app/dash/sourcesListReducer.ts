export default function sourcesListReducer(
  state: SourceListItem[],
  action: SourceListAction
): SourceListItem[] {
  switch (action.type) {
    case "add":
      return [action.payload, ...state];
    case "remove":
      return state.filter((source) => source._id !== action.payload);
    case "update":
      return state.map((source) =>
        source._id === action.payload._id ? action.payload : source
      );
    case "load":
      return action.payload;
    default:
      return state;
  }
}