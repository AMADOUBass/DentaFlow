import { getAllPosts } from '@/lib/blog'
import Link from 'next/link'
import { Metadata } from 'next'
import { BookOpen, Clock, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oros.ca'

export const metadata: Metadata = {
  title: 'Blog | Oros',
  description: 'Conseils de gestion, conformité Loi 25, technologie dentaire — le blog des cliniques dentaires québécoises.',
  openGraph: {
    title: 'Blog Oros — Ressources pour cliniques dentaires',
    description: 'Conseils pratiques de gestion, conformité Loi 25 et technologie pour les cliniques du Québec.',
    images: [`${BASE_URL}/api/og/marketing?title=Blog+Oros&subtitle=Ressources+pour+cliniques+dentaires+qu%C3%A9b%C3%A9coises&tag=Blog`],
  },
  twitter: {
    card: 'summary_large_image',
    images: [`${BASE_URL}/api/og/marketing?title=Blog+Oros&subtitle=Ressources+pour+cliniques+dentaires+qu%C3%A9b%C3%A9coises&tag=Blog`],
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'Conformité': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Gestion clinique': 'bg-primary/10 text-primary border-primary/20',
  'Technologie': 'bg-violet-50 text-violet-700 border-violet-100',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-6 text-center relative">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
            <BookOpen className="h-3.5 w-3.5" />
            Blog & Ressources
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Le savoir au service de votre clinique
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Conseils pratiques de gestion, conformité Loi 25, et tendances technologiques pour les cliniques dentaires du Québec.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-slate-400 italic py-20">Aucun article pour l'instant.</p>
        ) : (
          <div className="grid gap-8">
            {posts.map((post, i) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className={`group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 overflow-hidden flex ${i === 0 ? 'flex-col' : 'flex-col md:flex-row'}`}>
                  {i === 0 && (
                    <div className="h-2 bg-gradient-to-r from-primary to-teal-400 w-full" />
                  )}
                  <div className={`p-8 flex flex-col gap-4 ${i !== 0 ? 'flex-1' : ''}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-black px-3 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        <Tag className="h-3 w-3 inline mr-1" />
                        {post.category}
                      </span>
                      {i === 0 && (
                        <span className="text-xs font-black bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full">
                          Mis en avant
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className={`font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors ${i === 0 ? 'text-3xl' : 'text-xl'}`}>
                        {post.title}
                      </h2>
                      <p className="text-slate-500 mt-2 leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mt-auto pt-2 border-t border-slate-50">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{format(new Date(post.date), 'd MMM yyyy', { locale: fr })}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} de lecture
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
