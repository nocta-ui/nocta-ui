import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Background from './background';

export default function HomePage() {
  return (
    <main className="h-[94vh] lg:h-[93vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden relative">
      <div className="absolute inset-0">
        <Background />
      </div>
      
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center space-y-8 z-10 relative pointer-events-none">
        <div className="pointer-events-none">
          <Badge variant="secondary" className="text-xs font-medium">
            Your Code, Your Rules
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-none pointer-events-none">
          NOCTA UI
        </h1>
        
        <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 font-light max-w-2xl pointer-events-none">
          Modern React components built with TypeScript & Tailwind CSS.
          <br />
          Copy, paste, customize.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl pointer-events-none">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 rounded-full bg-neutral-900 dark:bg-neutral-100"></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Copy-Paste</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Own your code</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3 h-3 rounded-full bg-neutral-900 dark:bg-neutral-100"></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">TypeScript</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Fully typed</span>
          </div>
          <div className="flex flex-col items-center space-y-2 col-span-2 sm:col-span-1">
            <div className="w-3 h-3 rounded-full bg-neutral-900 dark:bg-neutral-100"></div>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Accessible</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">WCAG compliant</span>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/30 backdrop-blur-sm rounded-xl p-4 max-w-md pointer-events-none">
          <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 space-y-1">
            <div># Get started in 30 seconds</div>
            <div className="text-neutral-800 dark:text-neutral-200">npx nocta-ui-cli add button</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <Link href="/docs">
            <Button className="px-8 py-3 font-medium">
              Documentation
            </Button>
          </Link>
          <Link target="_blank" rel="noopener noreferrer" href="https://github.com/66HEX/nocta-ui">
            <Button variant="secondary" className="px-8 py-3 font-medium">
              GitHub
              <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
