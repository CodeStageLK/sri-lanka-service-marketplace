import { Button } from '@/components/ui/button';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a className="text-xl font-bold tracking-tight text-primary" href="/">SERV HUB</a>
          <span className="text-sm">Customer marketplace</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Sri Lanka service marketplace</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-primary sm:text-5xl">
          Every Service. One Platform.
        </h1>
        <p className="mt-6 max-w-2xl text-lg">
          A foundation for connecting customers with service providers across Sri Lanka.
        </p>
        <Button className="mt-8" asChild><a href="#about">Learn about SERV HUB</a></Button>
        <section id="about" className="mt-16 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-primary">Built for local services</h2>
          <p className="mt-2">Service discovery and customer features will be introduced in later phases.</p>
        </section>
      </main>
    </div>
  );
}
