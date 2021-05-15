import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'

const Blog = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

export function getStaticProps(context) {
  // read post from content.ts aka our cms.
  const cmsPost = (context.preview ? postsFromCMS.draft: postsFromCMS.published).map(post => {
    const { data } = matter(post)
    return data
  })

  // read post from post folder
  const postPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postPath)
  const filePosts = filenames.map(file => {
    const filePath = path.join(postPath, file)
    const filedata = fs.readFileSync(filePath)
    const { data } = matter(filedata)
    return data
  })

  const posts = [...cmsPost, ...filePosts]

  return {
    props: {posts}
  }
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */
