"use client";

import Link from "next/link";

interface FrameworkOption {
  id: "vite" | "nextjs" | "reactrouter";
  name: string;
  description: string;
  logo: React.ReactNode;
}

interface FrameworkSelectorProps {
  onSelect?: (framework: "vite" | "nextjs" | "reactrouter") => void;
  defaultSelected?: "vite" | "nextjs" | "reactrouter";
  className?: string;
}

const ViteLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    fill="currentColor"
  >
    <title>Vite</title>
    <path d="m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z"></path>
  </svg>
);

const NextJsLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    fill="currentColor"
  >
    <title>Next.js</title>
    <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.096-.0633c.8518-.5536 1.7525-1.3418 2.4657-2.1627 1.5179-1.7429 2.4963-3.868 2.8247-6.134.0961-.6591.1078-.854.1078-1.7475 0-.8937-.012-1.0884-.1078-1.7476-.6522-4.506-3.8592-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.42-2.4985-.5232-.169-.0176-1.0835-.0366-1.6123-.037zm4.0685 7.217c.3473 0 .4082.0053.4857.047.1127.0562.204.1642.237.2767.0186.061.0234 1.3653.0186 4.3044l-.0067 4.2175-.7436-1.14-.7461-1.14v-3.066c0-1.982.0093-3.0963.0234-3.1502.0375-.1313.1196-.2346.2323-.2955.0961-.0494.1313-.054.4997-.054z"></path>
  </svg>
);

const ReactRouterLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-16 w-16"
    fill="currentColor"
  >
    <title>React Router</title>
    <path d="M12.118 5.466a2.306 2.306 0 0 0-.623.08c-.278.067-.702.332-.953.583-.41.423-.49.609-.662 1.469-.08.423.41 1.43.847 1.734.45.317 1.085.502 2.065.608 1.429.16 1.84.636 1.84 2.197 0 1.377-.385 1.747-1.96 1.906-1.707.172-2.58.834-2.765 2.117-.106.781.41 1.76 1.125 2.091 1.627.768 3.15-.198 3.467-2.196.211-1.284.622-1.642 1.998-1.747 1.588-.133 2.409-.675 2.713-1.787.278-1.02-.304-2.157-1.297-2.554-.264-.106-.873-.238-1.35-.291-1.495-.16-1.879-.424-2.038-1.39-.225-1.337-.317-1.562-.794-2.09a2.174 2.174 0 0 0-1.613-.73zm-4.785 4.36a2.145 2.145 0 0 0-.497.048c-1.469.318-2.17 2.051-1.35 3.295 1.178 1.774 3.944.953 3.97-1.177.012-1.193-.98-2.143-2.123-2.166zM2.089 14.19a2.22 2.22 0 0 0-.427.052c-2.158.476-2.237 3.626-.106 4.182.53.145.582.145 1.111.013 1.191-.318 1.866-1.456 1.549-2.607-.278-1.02-1.144-1.664-2.127-1.64zm19.824.008c-.233.002-.477.058-.784.162-1.39.477-1.866 2.092-.98 3.336.557.794 1.96 1.058 2.82.516 1.416-.874 1.363-3.057-.093-3.746-.38-.186-.663-.271-.963-.268z"></path>
  </svg>
);

const frameworks: FrameworkOption[] = [
  {
    id: "vite",
    name: "Vite",
    description:
      "React with Vite for a fast and lightweight development workflow",
    logo: <ViteLogo />,
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "React framework with server-side rendering, static generation, and API routes",
    logo: <NextJsLogo />,
  },
  {
    id: "reactrouter",
    name: "React Router",
    description:
      "React Router 7 in framework mode with type-safe routes, SPA, SSR, and static rendering",
    logo: <ReactRouterLogo />,
  },
];

const FrameworkSelector = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {frameworks.map((framework) => (
          <Link
            href={`/docs/${framework.id}`}
            key={framework.id}
            className="group no-underline"
          >
            <button
              type="button"
              key={framework.id}
              className={`relative h-full w-full cursor-pointer`}
            >
              <div className="group flex h-full w-full flex-col items-center justify-center gap-4 rounded-md border border-none border-border bg-card p-8 shadow-sm transition-colors duration-200 hover:bg-card-muted text-foreground/70 hover:text-foreground dark:border-solid">
                {framework.logo}
                <div className="mt-3">
                  <span className="block text-lg font-medium text-foreground/70 group-hover:text-foreground transition-colors duration-200">
                    {framework.name}
                  </span>
                  <span className="block text-sm text-foreground/45 group-hover:text-foreground/70 transition-colors duration-200">
                    {framework.description}
                  </span>
                </div>
              </div>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { FrameworkSelector };
export type { FrameworkSelectorProps };
