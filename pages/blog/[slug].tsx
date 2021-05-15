import React, { FC } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import { posts as postsFromCMS } from '../../content'
import renderToString from 'next-mdx-remote/render-to-string'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

export function getStaticPaths() {
  const postPath = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postPath)
  const slugs = filenames.map(file => {
    const filePath = path.join(postPath, file)
    const filedata = fs.readFileSync(filePath)
    const { data } = matter(filedata)
    return {params: {slug: data.slug}}
  })

  return {
    paths: slugs,
    fallback: true,
  }
}

/**
 * Need to get the paths here
 * then the the correct post for the matching path
 * Posts can come from the fs or our CMS
 */

export async function getStaticProps({ params, preview }) {
  let post

  try {
    // read post from post folder
    const filePath = path.join(process.cwd(), 'posts', `${params.slug}.mdx`)
    post = fs.readFileSync(filePath, 'utf-8')
  } catch {
    // read post from content.ts aka our cms.
    const cmsPost = (preview ? postsFromCMS.draft: postsFromCMS.published).map(p => matter(p))
    const match = cmsPost.find(p => p.data.slug === params.slug)
    post = match
  }
  const { content, data } = matter(post)
  const mdxSource = await renderToString(content, {scope: data})

  return {
    props: {
      source: mdxSource,
      frontMatter: data
    }
  }
}

export default BlogPost;
