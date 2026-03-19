export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    signUp: "/auth/sign-up",
    signUpSuccess: "/auth/sign-up-success",
    forgotPassword: "/auth/forgot-password",
    updatePassword: "/auth/update-password",
    confirm: "/auth/confirm",
    error: "/auth/error",
  },
  dashboard: "/dashboard",
  profile: "/profile",
  admin: "/admin",
  events: {
    list: "/events",
    create: "/events/create",
    detail: (slug: string) => `/events/${slug}` as const,
    edit: (id: string) => `/events/edit/${id}` as const,
    editReadOnly: `/events/edit` as const,
  },
  apply: {
    pending: "/apply/pending",
  },
} as const;

export type AppRoutes = typeof ROUTES;
