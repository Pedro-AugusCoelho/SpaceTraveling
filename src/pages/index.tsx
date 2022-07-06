import { asText } from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from "next/head";
import Link from 'next/link';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';
import { AiOutlineCalendar } from "react-icons/ai";

//import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({postsPagination}:HomeProps): JSX.Element {


  return (
    <>
      <Head>SpaceTraveling</Head>
      <main className={styles.Container}>
        <Header />
        <div className={styles.ContainerPosts}>
          {postsPagination.results.map(item => (
            <Link  href={`/posts/${encodeURIComponent(item.uid)}`} key={item.uid}>
              <a>
              
                <div className={styles.PostItem}>
              
                  <h1>Como utilizar Hooks</h1>
              
                  <p>Pensando em sincronização em vez de ciclos de vida.</p>
              
                  <div className={styles.ContainerPostAuthor_Date}>
                    <div className={styles.ContentInfo}>
                      <AiOutlineCalendar size={20} />
                      15 Mar 2021
                    </div>
                    
                    <div className={styles.ContentInfo}>
                      <AiOutlineCalendar size={20} />
                      15 Mar 2021
                    </div>
                  
                  </div>
              
                </div>
              
              </a>
            </Link>
          ))
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps:GetStaticProps = async () => {

  const prismic = getPrismicClient({});
  const postsPagination = await prismic.getByType('posts');
  return {props: {postsPagination}};
};