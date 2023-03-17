import sveltePersistentStore from "svelte-persistent-store";

const local = sveltePersistentStore.local;
export const uid = local.writable("uid", 0);
export const notesStore = local.writable("notes", [
  {
    id: -4,
    title: "Welcome to Keep",
    content: "A pretty nice way to <strong>keep</strong> your notes",
    background: "#1CE9B5",
  },
  {
    id: -3,
    title: "How it's made",
    content:
      'This simple app is made using <a href="https://svelte.dev/"><i>Svelte</i></a>',
    background: "#E77E7E",
  },
  {
    id: -2,
    title: "And now?",
    content:
      "If you have anything to write down, some thoughts or ideas, you can use this wonderful app",
    background: "#F4EBEB",
  },
  {
    id: -1,
    title: "Made by",
    content: "<b>Alessandro Pucci (mat. 869177)</b>",
    background: "#C5F2C4",
  },
]);
export const trashStore = local.writable("trash", []);
