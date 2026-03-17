"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

type Props = {
  callbackUrl?: string;
};

export default function LogoutButton({ callbackUrl = "/" }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => signOut({ callbackUrl })}
    >
      Logout
    </Button>
  );
}