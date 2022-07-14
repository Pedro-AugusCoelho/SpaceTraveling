import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { AiOutlineCalendar, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { asHTML, asText } from '@prismicio/helpers';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}:PostProps) {

  console.log(post);

  const totalPostPhrases = post.data.content.reduce((acc, item) => {
    const heading = item.heading.trim().split(' ').length;
    const body = item.body.reduce((accumulator, { text }) => {
      return (accumulator += text.trim().split(' ').length);
    }, 0);

    return (acc += heading + body);
  }, 0);

  const minutesToReadThePost = Math.ceil(totalPostPhrases / 200);

  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }
  
  return(
    <div className={commonStyles.Container}>
      <Head>SpaceTraveling | Post</Head>
      <Header />
      <div className={styles.ContainerBanner}>
        <img src={post.data.banner.url} alt='Banner' className={styles.Banner} />
      </div>

      <div className={styles.ContainerInfo}>
        
        <div className={styles.headerInfo}>
          <h1>{post.data.title}</h1>
          
          <div className={styles.ContainerPostAuthor_Date}>
            
            <div className={styles.ContentAuthorDate}>
              <AiOutlineCalendar size={20} />
              {format(parseISO(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
              }).toString()}
            </div>
            
            <div className={styles.ContentAuthorDate}>
              <AiOutlineUser size={20} />
              {post.data.author}
            </div>

            <div className={styles.ContentAuthorDate}>
              <AiOutlineClockCircle size={20} />
              {minutesToReadThePost} min
            </div>
          
          </div>
        
        </div>

        <div className={styles.Body}>
          {post.data.content.map((data) => (
            <div className={styles.Post}>
  
              <h1>{data.heading}</h1>
              
              <div className={styles.Description}>
                {data.body.map((description , k) => (
                  <span key={k}>
                    {description.text}
                  </span>
                ))}
              </div>
  
            </div>
  
          ))
          }
        </div>
      
      </div>
    
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    lang: 'pt-BR',
  });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps:GetStaticProps = async ({params}) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts' , String(params.slug));
  
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: asText(response.data.title),
      subtitle: asText(response.data.subtitle),
      banner: {
        url: response.data.banner.url,
      },
      author: asText(response.data.author),
      content: response.data.content,
    },
  };

  return{
    props:{post},
    revalidate: 60 * 30 //30min
  }
};
