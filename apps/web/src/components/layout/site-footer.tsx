export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="container mx-auto px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <p>© 2026 Ecom. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Shipping</span>
            <span>Returns</span>
            <span>Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}