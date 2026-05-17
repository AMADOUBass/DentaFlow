import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Clock, Tag, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oros.ca'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const ogUrl = `${BASE_URL}/api/og/marketing?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.description)}&tag=${encodeURIComponent(post.category)}`

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [ogUrl],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl],
    }
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <article className="min-h-screen">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6 space-y-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour au blog
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {post.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} de lecture
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">{post.description}</p>

          <div className="flex items-center gap-3 text-sm text-slate-400 font-medium pt-2 border-t border-slate-100">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
            <span>·</span>
            <span>{format(new Date(post.date), 'd MMMM yyyy', { locale: fr })}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-slate-100" />
      </div>

      {/* Content — rendered as plain HTML from markdown-like structure */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="prose prose-slate prose-lg max-w-none
          prose-headings:font-black prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:leading-relaxed prose-p:text-slate-600
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:text-slate-600 prose-li:leading-relaxed
          prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-xl prose-blockquote:not-italic
          prose-code:bg-slate-100 prose-code:text-primary prose-code:rounded prose-code:px-1
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        ">
          <RenderMarkdown content={post.content} />
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-slate-900 rounded-[2rem] p-10 text-center space-y-4">
          <h2 className="text-2xl font-black text-white">Prêt à moderniser votre clinique ?</h2>
          <p className="text-slate-400">Essai gratuit 14 jours, sans carte de crédit.</p>
          <Link
            href="/register"
            className="inline-block bg-primary text-white font-black px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </article>
  )
}

function RenderMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let key = 0

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++}>
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
          ))}
        </ul>
      )
      listItems = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      flushList()
      elements.push(<h3 key={key++} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.slice(4)) }} />)
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(<h2 key={key++} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.slice(3)) }} />)
    } else if (line.startsWith('> ')) {
      flushList()
      elements.push(<blockquote key={key++} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line.slice(2)) }} />)
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2))
    } else if (line.startsWith('---')) {
      flushList()
      elements.push(<hr key={key++} />)
    } else if (line.trim() === '') {
      flushList()
    } else {
      flushList()
      elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />)
    }
  }

  flushList()
  return <>{elements}</>
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
}
