import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function HomePage() {
  return (
    <main className="h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      {/* Version Badge */}
      <div className="mb-8">
        <Badge variant="secondary" className="text-xs font-medium">
          v1.0.0
        </Badge>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6 leading-none">
        NOCTA UI
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-12 font-light max-w-md">
        React components. 
        <br />
        Beautifully crafted.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/docs">
          <Button className="px-8 py-3 font-medium">
            Documentation
          </Button>
        </Link>
        <Link href="/docs/components">
          <Button variant="ghost" className="px-8 py-3 font-medium">
            Components
          </Button>
        </Link>
      </div>
    </main>
  );
}
