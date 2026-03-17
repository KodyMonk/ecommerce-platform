import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#f4f4f4] text-neutral-700">
      <div className="mx-auto max-w-[1280px] px-4 py-14">
        <div className="grid gap-10 border-b border-neutral-300 pb-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              Subscribe to our newsletter
            </h3>

            <form className="mt-6 flex max-w-[640px] overflow-hidden border border-neutral-400 bg-white">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 px-4 text-sm outline-none"
              />
              <button
                type="submit"
                className="h-12 bg-neutral-600 px-8 text-sm font-medium uppercase tracking-[0.1em] text-white"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="md:justify-self-end">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              Follow us
            </h3>

            <div className="mt-6 flex items-center gap-4">
              <Link href="#" className="transition hover:text-black">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="transition hover:text-black">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="transition hover:text-black">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              Customer Service
            </h4>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="#" className="block hover:text-black">Delivery</Link>
              <Link href="#" className="block hover:text-black">Returns</Link>
              <Link href="/orders" className="block hover:text-black">Track your order</Link>
              <Link href="#" className="block hover:text-black">Payment methods</Link>
              <Link href="#" className="block hover:text-black">Warranty</Link>
              <Link href="#" className="block hover:text-black">Contact us</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              More Info
            </h4>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="#" className="block hover:text-black">Terms of Sale</Link>
              <Link href="#" className="block hover:text-black">Website Terms of Use</Link>
              <Link href="#" className="block hover:text-black">Privacy Policy</Link>
              <Link href="#" className="block hover:text-black">Cookies</Link>
              <Link href="#" className="block hover:text-black">Online Sale Terms & Conditions</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              About Us
            </h4>
            <div className="mt-5 space-y-3 text-sm">
              <Link href="#" className="block hover:text-black">FAQ’s</Link>
              <Link href="#" className="block hover:text-black">Our Stores</Link>
              <Link href="#" className="block hover:text-black">About Ecom</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-neutral-900">
              Customer Care
            </h4>
            <div className="mt-5 space-y-3 text-sm">
              <p>
                E-mail:{" "}
                <a
                  href="mailto:support@ecom.com"
                  className="underline underline-offset-4 hover:text-black"
                >
                  support@ecom.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-300 pt-8 text-center text-xs text-neutral-500">
          P.O Box 16, Kingdom of Bahrain | Ecom 2026 © All Rights Reserved
        </div>
      </div>
    </footer>
  );
}