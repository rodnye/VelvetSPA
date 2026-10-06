import { useState } from 'react';
import heroImg from './assets/hero.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col border-x border-gray-200 text-center text-base text-gray-500 lg:text-lg dark:border-gray-800 dark:text-gray-400">
        <section className="flex grow flex-col place-content-center place-items-center gap-4 px-5 pt-8 pb-6 lg:gap-6 lg:p-0">
          <div className="relative">
            <img
              src={heroImg}
              className="relative z-0 mx-auto w-44"
              width="170"
              height="179"
              alt=""
            />
            <img
              src={reactLogo}
              className="absolute inset-x-0 top-8 z-10 mx-auto h-7 transform-3d rotate-x-45 rotate-y-45 rotate-z-45 scale-150 perspective-distant"
              alt="React logo"
            />
            <img
              src={viteLogo}
              className="absolute inset-x-0 top-28 z-0 mx-auto h-6 w-auto transform-3d rotate-x-45 rotate-y-45 rotate-z-45 scale-75 perspective-distant"
              alt="Vite logo"
            />
          </div>
          <div>
            <h1 className="my-5 text-4xl font-medium tracking-tight text-gray-900 lg:my-8 lg:text-5xl dark:text-gray-100">
              Get started
            </h1>
            <p>
              Edit
              <code className="inline-flex rounded bg-gray-100 px-2 py-1 font-mono text-sm leading-snug text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                src/App.tsx
              </code>
              and save to test
              <code className="inline-flex rounded bg-gray-100 px-2 py-1 font-mono text-sm leading-snug text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                HMR
              </code>
            </p>
          </div>
          <button
            type="button"
            className="mb-6 inline-flex cursor-pointer rounded border-2 border-transparent bg-purple-500/10 px-2.5 py-1 font-mono text-base text-purple-500 transition-colors hover:border-purple-500/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 dark:bg-purple-400/15 dark:text-purple-400 dark:hover:border-purple-400/50 dark:focus-visible:outline-purple-400"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
        </section>

        <section className="flex flex-col border-t border-gray-200 text-center lg:flex-row lg:text-left dark:border-gray-800">
          <div className="flex-1 border-b border-gray-200 px-5 py-6 lg:border-b-0 lg:border-r lg:p-8 dark:border-gray-800">
            <svg
              className="mx-auto mb-4 h-5.5 w-5.5 lg:mx-0"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#documentation-icon"></use>
            </svg>
            <h2 className="mb-2 text-xl font-medium leading-tight tracking-tight text-gray-900 lg:text-2xl dark:text-gray-100">
              Documentation
            </h2>
            <p>Your questions, answered</p>
            <ul className="mt-5 flex list-none flex-wrap justify-center gap-2 p-0 lg:mt-8 lg:flex-nowrap lg:justify-start">
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://vite.dev/"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <img className="h-4.5" src={viteLogo} alt="" />
                  Explore Vite
                </a>
              </li>
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://react.dev/"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <img className="h-4.5 w-4.5" src={reactLogo} alt="" />
                  Learn more
                </a>
              </li>
            </ul>
          </div>
          <div className="flex-1 px-5 py-6 lg:p-8">
            <svg
              className="mx-auto mb-4 h-5.5 w-5.5 lg:mx-0"
              role="presentation"
              aria-hidden="true"
            >
              <use href="/icons.svg#social-icon"></use>
            </svg>
            <h2 className="mb-2 text-xl font-medium leading-tight tracking-tight text-gray-900 lg:text-2xl dark:text-gray-100">
              Connect with us
            </h2>
            <p>Join the Vite community</p>
            <ul className="mt-5 flex list-none flex-wrap justify-center gap-2 p-0 lg:mt-8 lg:flex-nowrap lg:justify-start">
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://github.com/vitejs/vite"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <svg
                    className="h-4.5 w-4.5 dark:invert dark:brightness-200"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#github-icon"></use>
                  </svg>
                  GitHub
                </a>
              </li>
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://chat.vite.dev/"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <svg
                    className="h-4.5 w-4.5 dark:invert dark:brightness-200"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#discord-icon"></use>
                  </svg>
                  Discord
                </a>
              </li>
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://x.com/vite_js"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <svg
                    className="h-4.5 w-4.5 dark:invert dark:brightness-200"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#x-icon"></use>
                  </svg>
                  X.com
                </a>
              </li>
              <li className="flex-1 basis-1/2 lg:flex-none lg:basis-auto">
                <a
                  href="https://bsky.app/profile/vite.dev"
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100/50 px-3 py-1.5 text-base text-gray-900 no-underline transition-shadow hover:shadow-lg lg:w-auto dark:bg-gray-800/50 dark:text-gray-100"
                >
                  <svg
                    className="h-4.5 w-4.5 dark:invert dark:brightness-200"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#bluesky-icon"></use>
                  </svg>
                  Bluesky
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="h-12 border-t border-gray-200 lg:h-22 dark:border-gray-800" />
      </div>
    </div>
  );
}

export default App;
