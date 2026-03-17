import { NextResponse } from "next/server";
import {
  createSavedAddress,
  deleteSavedAddress,
  getSavedAddressesForCurrentUser,
} from "@/lib/addresses";

export const runtime = "nodejs";

export async function GET() {
  try {
    const addresses = await getSavedAddressesForCurrentUser();

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("GET /api/account/addresses error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to load addresses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["fullName", "line1", "city", "country"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const address = await createSavedAddress({
      fullName: body.fullName,
      phone: body.phone || "",
      line1: body.line1,
      line2: body.line2 || "",
      city: body.city,
      state: body.state || "",
      postalCode: body.postalCode || "",
      country: body.country,
    });

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error("POST /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to save address",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const addressId = String(body.addressId || "");

    if (!addressId) {
      return NextResponse.json(
        { success: false, error: "addressId is required" },
        { status: 400 }
      );
    }

    await deleteSavedAddress(addressId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete address",
      },
      { status: 500 }
    );
  }
}