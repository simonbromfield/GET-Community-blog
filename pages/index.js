import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Head from 'next/head'
import Post from '../components/Post'
import Tweet from '../components/TweetThread'
import Grid from '@mui/material/Grid';
import { shuffleArray } from '../utils'
import { Container } from '@mui/system'

export default function Home({ posts }) {
  
  function postTypeSwitch(post, index) {
    switch(post.frontmatter.type) {
      case 'blog':
        return <Post key={index} post={post} />;
      case 'twitter':
        return <Tweet key={index} post={post} />;
      default:
        return <h2 key={index}>not blog</h2>;
    }
  }

  return (
    <div>
      <Head>
        <title>GET Community Blog & Resources</title>
      </Head>
      <Container id="resources" maxWidth={false}>
      </Container>
      <Grid container spacing={2}>
        {posts.map((post, index) => (
          postTypeSwitch(post, index)
        ))}
      </Grid>
    </div>
  )
}

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'))

  // Get slug and frontmatter from posts
  const posts = files.map((filename) => {
    // Create slug
    const slug = filename.replace('.md', '')

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data: frontmatter } = matter(markdownWithMeta)

    return {
      slug,
      frontmatter,
    }
  })

  return {
    props: {
      posts: shuffleArray(posts),
    },
  }
}
