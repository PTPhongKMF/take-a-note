import { createContext, type ParentProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const NoteContext = createContext();

export function NoteProvider(props: ParentProps) {
  const [note, setNote] = createStore();

  const noteStore = { note, setNote };

  return (
    <NoteContext.Provider value={noteStore}>
      {props.children}
    </NoteContext.Provider>
  );
}

export function useNote() {
  const context = useContext(NoteContext);

  if (!context) {
    throw new Error("useNote must be used within a NoteProvider");
  }

  return context;
}
