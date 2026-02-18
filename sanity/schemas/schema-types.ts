export const SCHEMA_TYPES = {
  HOME_PAGE: "homePage",
  HEADER: "header",
  FOOTER: "footer",
  DICTIONARIES: "dictionaries",
} as const;

export type SchemaType = (typeof SCHEMA_TYPES)[keyof typeof SCHEMA_TYPES];
