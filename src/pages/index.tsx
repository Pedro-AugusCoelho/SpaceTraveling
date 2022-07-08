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
import { FormatDate } from '../hooks/FormatDate';
import { useState } from 'react';

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
  posts: PostPagination;
}

export default function Home({posts}:HomeProps): JSX.Element {
  
  const [listPosts, setListPosts] = useState(posts.results);
  const [nextPage, setNextPage] = useState(posts.next_page);

  const loadAllPosts = async (link: string) => {
    const response = await fetch(link);
    const json = await response.json();
    const newPost:Post[] = json.results.map((post) => {
      return{
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title:asText(post.data.title),
          subtitle:asText(post.data.subtitle),
          author:asText(post.data.author),
        }
      }
    })
    setListPosts([...listPosts, ...newPost]);
    setNextPage(json.next_page);
  }

  return (
    <>
      <Head>SpaceTraveling</Head>
      <main className={commonStyles.Container}>
        <Header />
        <div className={styles.ContainerPosts}>
          {listPosts.map(item => (
            <Link  href={`/post/${encodeURIComponent(item.uid)}`} key={item.uid}>
              <a>
              
                <div className={styles.PostItem}>
              
                  <h1>{item.data.title}</h1>
              
                  <p>{item.data.subtitle}</p>
              
                  <div className={styles.ContainerPostAuthor_Date}>
                    <div className={styles.ContentInfo}>
                      <AiOutlineCalendar size={20} />
                      {FormatDate(item.first_publication_date)}
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

        {nextPage &&

          <div className={styles.ContainerBtn}>
            <div onClick={() => loadAllPosts(nextPage)} className={styles.btn}>
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
  const response = await prismic.getByType('posts', {pageSize: 1});


  const results = response.results.map((post) => {
    return{
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title:asText(post.data.title),
        subtitle:asText(post.data.subtitle),
        author:asText(post.data.author),
      }
    }
  });

  const posts:PostPagination = {
    next_page:response.next_page,
    results:results,
  };

  return {props: {posts}};
};