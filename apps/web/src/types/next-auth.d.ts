import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}