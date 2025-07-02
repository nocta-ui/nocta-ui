import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card/card';
import Background from './background';

export default function HomePage() {
  return (
    <main className="h-[93svh] flex flex-col justify-center items-center text-center px-6 overflow-hidden relative">
      <div className="absolute inset-0">
        <Background />
      </div>
      
      
      
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center space-y-8 md:space-y-12 z-10 relative pointer-events-none">
        {/* Professional badge */}
        <div className="pointer-events-none">
          <Badge variant="secondary" className="text-xs font-medium tracking-wider border-nocta-300/50 dark:border-nocta-600/50 bg-nocta-100/50 dark:bg-nocta-800/50">
            Your Code, Your Rules
          </Badge>
        </div>

        {/* Clean, professional title */}
        <div className="pointer-events-none">
          <h1 className="font-pp-neue-machina text-7xl sm:text-8xl lg:text-9xl font-bold text-nocta-900 dark:text-nocta-100 leading-[0.9] tracking-tight pointer-events-none">
            NOCTA UI
          </h1>
        </div>
        
        {/* Professional subtitle */}
        <div className="pointer-events-none max-w-2xl">
          <p className="text-xl sm:text-2xl text-nocta-800 dark:text-nocta-200 font-medium leading-tight">
            Production-Ready React Components
          </p>
          <p className="text-base text-nocta-600 dark:text-nocta-400 font-normal mt-3 leading-relaxed">
            TypeScript-first component library built for modern web applications.
            Copy, integrate, ship.
          </p>
        </div>

        {/* Modern feature showcase */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-4xl pointer-events-none">
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-2 h-2 bg-nocta-600 dark:bg-nocta-400 rounded-full"></div>
            <span className="text-sm font-medium text-nocta-800 dark:text-nocta-200">Copy & Paste</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-nocta-600 dark:bg-nocta-400 rounded-full"></div>
            <span className="text-sm font-medium text-nocta-800 dark:text-nocta-200">TypeScript First</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-nocta-600 dark:bg-nocta-400 rounded-full"></div>
            <span className="text-sm font-medium text-nocta-800 dark:text-nocta-200">Fully Accessible</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-nocta-600 dark:bg-nocta-400 rounded-full"></div>
            <span className="text-sm font-medium text-nocta-800 dark:text-nocta-200">Minimal Dependencies</span>
          </div>
        </div>

        {/* Clean code snippet */}
        <Card className="p-6 max-w-md pointer-events-none">
          <div className="text-sm font-mono text-nocta-700 dark:text-nocta-300 space-y-2">
            <div className="text-nocta-500 dark:text-nocta-500"># Get started in 30 seconds</div>
            <div className="text-nocta-800 dark:text-nocta-200">npx nocta-ui init</div>
          </div>
        </Card>

        {/* Professional CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pointer-events-auto">
          <Link href="/docs">
            <Button className="px-8 py-3 font-semibold text-sm bg-nocta-900 hover:bg-nocta-800 dark:bg-nocta-100 dark:hover:bg-nocta-200 dark:text-nocta-900 transition-colors">
              View Documentation
            </Button>
          </Link>
          <Link target="_blank" rel="noopener noreferrer" href="https://github.com/66HEX/nocta-ui">
            <Button variant="secondary" className="px-8 py-3 font-semibold text-sm border border-nocta-300 dark:border-nocta-600 hover:border-nocta-400 dark:hover:border-nocta-500 transition-colors">
              GitHub Repository
              <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
