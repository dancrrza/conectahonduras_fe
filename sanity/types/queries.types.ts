export const languageFilter = `(language == $locale || !defined(language))`;
export const excludeDraftsFilter = `!(_id in path("drafts.**"))`;
