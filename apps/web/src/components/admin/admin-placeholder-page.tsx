type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <main className="px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-2xl border p-8">
        <p className="text-sm text-muted-foreground">
          This section is ready for the next build phase.
        </p>
      </div>
    </main>
  );
}