import { NoteWithCategory } from "@/types/database";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const getUserName = (
  userId: string,
  users: Array<{ id: string; name: string }>
) => {
  const foundUser = users.find((u) => u.id === userId);
  return foundUser?.name || "Unknown User";
};

export const filterNotes = (
  notes: NoteWithCategory[],
  searchQuery: string,
  selectedCategory: string
) => {
  return notes
    .filter((note) => {
      // Search filter
      const matchesSearch =
        note.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.note_categories?.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || note.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort(
      (a, b) =>
        new Date(b.lastUpdatedDate).getTime() -
        new Date(a.lastUpdatedDate).getTime()
    );
};

export const paginateNotes = (
  notes: NoteWithCategory[],
  currentPage: number,
  itemsPerPage: number = 30
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    paginatedNotes: notes.slice(startIndex, endIndex),
    totalPages: Math.ceil(notes.length / itemsPerPage),
    totalItems: notes.length,
    hasNextPage: endIndex < notes.length,
    hasPreviousPage: currentPage > 1,
  };
};
