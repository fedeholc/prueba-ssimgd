export default function sourceListReducer(
  state: SourceListItem[],
  action: SourceListAction
): SourceListItem[] {
  switch (action.type) {
    case "add":
      //check if there is already a new source
      if (state.find((source) => source._id === "0")) {
        return state;
      }
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