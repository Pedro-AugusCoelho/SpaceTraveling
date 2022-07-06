import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import { AppProps } from 'next/app';
import Link from 'next/link';
import { repositoryName } from '../services/prismic';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <>
      <PrismicProvider
        internalLinkComponent={({ href, children, ...props }) => (
          <Link href={href}>
            <a {...props}>
              {children}
            </a>
          </Link>
        )}
      >

      <PrismicPreview repositoryName={repositoryName}>
        <Component {...pageProps} />
      </PrismicPreview>

      </PrismicProvider>
    </>
  )
}

export default MyApp;
