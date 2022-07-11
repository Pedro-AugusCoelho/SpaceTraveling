import styles from './header.module.scss';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <header className={styles.Header}>
      <Link href="/">
        <a>
          <img src='/logo.svg' alt='logo'/>
        </a>
      </Link>
    </header>
  );
}
