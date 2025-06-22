import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C21.3137 0 24 2.68629 24 6V18C24 21.3137 21.3137 24 18 24H6C2.6863 24 8.24673e-06 21.3137 0 18V6C0 2.68629 2.68629 0 6 0H18ZM5 10C4.44772 10 4 10.4477 4 11V17C4 17.5523 4.44772 18 5 18H7C7.55228 18 8 17.5523 8 17V10H5ZM9 6C8.44772 6 8 6.44772 8 7V10H13.7139C13.979 9.99996 14.2334 9.89453 14.4209 9.70703C14.8114 9.3166 15.4444 9.31667 15.835 9.70703L16.6143 10.4854C17.0046 10.8758 17.0045 11.5089 16.6143 11.8994L16.293 12.2207C16.1055 12.4082 16 12.6626 16 12.9277V17C16 17.5523 16.4477 18 17 18H19C19.5523 18 20 17.5523 20 17V10.542C20 10.2768 19.8945 10.0225 19.707 9.83496L16.165 6.29297C15.9775 6.10547 15.7232 6.00004 15.458 6H9Z" fill="currentColor"/>
        </svg>
        <p className='font-pp-neue-machina font-semibold text-sm'>NOCTA UI</p>
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
