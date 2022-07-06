import styles from './header.module.scss';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <header className={styles.Header}>
      <Link href="/">
        <a>
          <div className={styles.Img}></div>
        </a>
      </Link>
      {/*<img src='../../../public/logo.png' alt='logo'/>*/}
    </header>
  );
}
