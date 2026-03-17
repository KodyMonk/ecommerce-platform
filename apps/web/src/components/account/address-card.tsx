"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/account/address-form";

type Props = {
  address: {
    id: string;
    fullName: string;
    phone: string | null;
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
  };
};

export default function AddressCard({ address }: Props) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete address for "${address.fullName}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch("/api/account/addresses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId: address.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete address");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Could not delete address");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-2xl border p-6">
      {!editing ? (
        <>
          <p className="font-medium">{address.fullName}</p>
          {address.phone ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {address.phone}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-muted-foreground">{address.line1}</p>
          {address.line2 ? (
            <p className="text-sm text-muted-foreground">{address.line2}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {address.city}
            {address.state ? `, ${address.state}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.postalCode ? `${address.postalCode}, ` : ""}
            {address.country}
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <AddressForm
            mode="edit"
            addressId={address.id}
            initialValues={{
              fullName: address.fullName,
              phone: address.phone || "",
              line1: address.line1,
              line2: address.line2 || "",
              city: address.city,
              state: address.state || "",
              postalCode: address.postalCode || "",
              country: address.country,
            }}
            onSuccess={() => setEditing(false)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}