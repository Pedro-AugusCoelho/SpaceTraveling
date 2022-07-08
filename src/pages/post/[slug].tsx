import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import { FormatDate } from '../../hooks/FormatDate';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { AiOutlineCalendar, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import Head from 'next/head';

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
              {FormatDate(post.first_publication_date)}
            </div>
            
            <div className={styles.ContentAuthorDate}>
              <AiOutlineUser size={20} />
              {post.data.author}
            </div>

            <div className={styles.ContentAuthorDate}>
              <AiOutlineClockCircle size={20} />
              4 Min
            </div>
          
          </div>
        
        </div>

        <div className={styles.Body}>
          {post.data.content.map((data) => (
            <div className={styles.Post}>
  
              <h1>{data.heading}</h1>
              
              <div className={styles.Description}>
                {data.body.map((description) => (
                  <>
                    {description.text}
                  </>
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

export const getStaticPaths = async() => {
    const prismic = getPrismicClient({});
    const posts = await prismic.getByType('posts');
  return{
    paths: [],
    fallback:'blocking',
  }
};

export const getStaticProps:GetStaticProps = async ({params}) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts' , String(params.slug));
  
  const post:Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data?.title[0].text,
      banner: {
        url: response.data?.banner.url,
      },
      author: response.data?.author[0].text,
      content: response.data.content.map((item) =>{
        return{
          heading: item.heading,
          body: item.body.map((itemBody) => {
            return{
              text: itemBody.text,
            }
          })
        }
      })
    }
  }

  return{
    props:{post},
    revalidate: 60 * 30 //30min
  }
};
