import { asText } from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from "next/head";
import Link from 'next/link';
import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';
import { AiOutlineCalendar , AiOutlineUser } from "react-icons/ai";


//import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  
  const [posts, setPosts] = useState(postsPagination);
  const [hasNext, setHasNext] = useState(!!postsPagination.next_page);

  function loadAllPosts(link: string) {
    fetch(link).then(response => response.json())
      .then(data => {
        const newPosts = {...posts};

        setPosts({
          ...newPosts,
          next_page: data.next_page,
          results: [...newPosts.results, ...data.results]
        })
        setHasNext(!!data.next_page)
      })
  }

  return (
    <>
      <Head>SpaceTraveling</Head>
      <main className={commonStyles.Container}>
        <Header />
        <div className={styles.ContainerPosts}>
          {posts.results.map(item => (
            <Link  href={`/post/${encodeURIComponent(item.uid)}`} key={item.uid}>
              <a>
                
                <div className={styles.PostItem}>
              
                  <h1>{item.data.title}</h1>
              
                  <p>{item.data.subtitle}</p>
              
                  <div className={styles.ContainerPostAuthor_Date}>
                    <div className={styles.ContentInfo}>
                      <AiOutlineCalendar size={20} />
                      {format(parseISO(item.first_publication_date), 'dd MMM yyyy', {
                        locale: ptBR,
                      }).toString()}
                    </div>
                    
                    <div className={styles.ContentInfo}>
                      <AiOutlineUser size={20} />
                      {item.data.author}
                    </div>
                  
                  </div>
              
                </div>
              
              </a>
            </Link>
          ))
          }
        </div>

        {hasNext &&

          <div className={styles.ContainerBtn}>
            <div onClick={() => loadAllPosts(posts.next_page)} className={styles.btn}>
              Carregar mais posts
            </div>
          
          </div>

        }
      
      </main>
    </>
  );
}

export const getStaticProps:GetStaticProps = async () => {

  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("posts", {
    lang: 'pt-BR',
    pageSize: 2,
  });

  const postsPagination = {...postsResponse}

  return {props: {postsPagination}};
};