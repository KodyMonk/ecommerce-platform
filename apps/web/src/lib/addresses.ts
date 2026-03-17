import { auth } from "@/auth";
import { db } from "@ecommerce/db";

export async function getCurrentUserRecord() {
  const session = await auth();

  if (!session?.user?.email) return null;

  return db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

export async function getSavedAddressesForCurrentUser() {
  const user = await getCurrentUserRecord();

  if (!user) return [];

  return db.address.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSavedAddressById(addressId: string) {
  const user = await getCurrentUserRecord();

  if (!user) return null;

  return db.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
    },
  });
}

export async function createSavedAddress(input: {
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}) {
  const user = await getCurrentUserRecord();

  if (!user) {
    throw new Error("You must be logged in to save an address");
  }

  return db.address.create({
    data: {
      userId: user.id,
      type: "SHIPPING",
      fullName: input.fullName,
      phone: input.phone || null,
      line1: input.line1,
      line2: input.line2 || null,
      city: input.city,
      state: input.state || null,
      postalCode: input.postalCode || null,
      country: input.country,
    },
  });
}

export async function updateSavedAddress(
  addressId: string,
  input: {
    fullName: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }
) {
  const user = await getCurrentUserRecord();

  if (!user) {
    throw new Error("You must be logged in to update an address");
  }

  const existing = await db.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
    },
  });

  if (!existing) {
    throw new Error("Address not found");
  }

  return db.address.update({
    where: {
      id: addressId,
    },
    data: {
      fullName: input.fullName,
      phone: input.phone || null,
      line1: input.line1,
      line2: input.line2 || null,
      city: input.city,
      state: input.state || null,
      postalCode: input.postalCode || null,
      country: input.country,
    },
  });
}

export async function deleteSavedAddress(addressId: string) {
  const user = await getCurrentUserRecord();

  if (!user) {
    throw new Error("You must be logged in to delete an address");
  }

  const address = await db.address.findFirst({
    where: {
      id: addressId,
      userId: user.id,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await db.address.delete({
    where: {
      id: addressId,
    },
  });

  return { success: true };
}