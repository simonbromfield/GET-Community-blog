import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Head from 'next/head'
import Post from '../components/Post'
import Tweet from '../components/TweetThread'
import Press from '../components/Press'
import BlogLink from '../components/BlogLinks'
import Grid from '@mui/material/Grid';
import { shuffleArray } from '../utils'
import { Container } from '@mui/system'
import Resources from '../components/Resources'
import BlogSelector from '../components/BlogSelector'

export default function Home({ posts }) {
  
  function postTypeSwitch(post, index) {
    switch(post.frontmatter.type) {
      case 'blog':
        return <Post key={index} post={post} />;
      case 'blogLink':
        return <BlogLink key={index} post={post} />;
      case 'twitter':
        return <Tweet key={index} post={post} />;
      case 'press':
        return <Press key={index} post={post} />;
      default:
        return <h2 key={index}>ERROR</h2>;
    }
  }

  return (
    <div>
      <Head>
        <title>GET Community Blog & Resources</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name='twitter:site' content='@bromdigital' />
        <meta name="twitter:title" content="GET Protocol Community" />
        <meta
          name="twitter:description"
          content="The NFT ticketing protocol's community page. Linking resources, blogs and useful links."
        />
        <meta
          name="twitter:image"
          content="https://www.get-community.com/static/images/og.png"
          />
      </Head>
      <BlogSelector />
      <Resources />
      <Container id="resources" maxWidth={false}>
      <Grid container spacing={2}>
        {posts.map((post, index) => (
          postTypeSwitch(post, index)
        ))}
        </Grid>
      </Container>
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
