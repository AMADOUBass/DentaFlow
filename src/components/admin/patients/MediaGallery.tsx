'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { saveMediaRecord, getMediaUrl, deleteMedia, initStorageBucket } from '@/server/actions/storage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  File, 
  Download,
  Trash2,
  Maximize2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

interface MediaItem {
  id: string
  name: string
  url: string
  storagePath: string
  category: string
  fileType: string
  createdAt: Date
  signedUrl?: string
}

export function MediaGallery({ patientId, initialMedia = [], tenantId }: { 
  patientId: string, 
  initialMedia?: any[],
  tenantId: string
}) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [isUploading, setIsUploading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const supabase = createClient()

  // Load signed URLs for private files
  useEffect(() => {
    async function loadUrls() {
      const updatedMedia = await Promise.all(
        media.map(async (m) => {
          if (m.signedUrl) return m
          const signedUrl = await getMediaUrl(m.storagePath)
          return { ...m, signedUrl: signedUrl || undefined }
        })
      )
      setMedia(updatedMedia)
    }
    loadUrls()
  }, [initialMedia])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    
    // Ensure bucket exists (Aide moi part)
    await initStorageBucket()

    for (const file of acceptedFiles) {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} est trop volumineux (> 10Mo)`)
        continue
      }

      const fileId = Math.random().toString(36).substring(7)
      const extension = file.name.split('.').pop()
      const storagePath = `${tenantId}/${patientId}/${fileId}.${extension}`
      
      const { error: uploadError } = await supabase.storage
        .from('patient-media')
        .upload(storagePath, file)

      if (uploadError) {
        toast.error(`Erreur d'upload pour ${file.name}`)
        console.error(uploadError)
        continue
      }

      const fileType = file.type.startsWith('image/') ? 'IMAGE' : 'PDF'
      const category = fileType === 'IMAGE' ? 'PHOTO' : 'DOC'

      const result = await saveMediaRecord({
        patientId,
        name: file.name,
        storagePath,
        fileType,
        category
      })

      if (result.success) {
        toast.success(`${file.name} ajouté au dossier`)
        // Refresh local state (simplified)
        const signedUrl = await getMediaUrl(storagePath)
        setMedia(prev => [{
          ...result.record as any,
          signedUrl: signedUrl || undefined
        }, ...prev])
      }
    }
    setIsUploading(false)
  }, [patientId, tenantId, supabase])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': []
    }
  })

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Voulez-vous supprimer ce document ?')) return

    const result = await deleteMedia(item.id, item.storagePath, patientId)
    if (result.success) {
      toast.success('Document supprimé')
      setMedia(prev => prev.filter(m => m.id !== item.id))
    }
  }

  const filteredMedia = activeCategory === 'ALL' 
    ? media 
    : media.filter(m => m.category === activeCategory)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={cn(
          "border-4 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer group",
          isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
           <div className={cn(
             "w-20 h-20 rounded-3xl flex items-center justify-center transition-all",
             isDragActive ? "bg-primary text-white" : "bg-slate-100 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary"
           )}>
              {isUploading ? <Loader2 className="h-10 w-10 animate-spin" /> : <Upload className="h-10 w-10" />}
           </div>
           <div>
              <p className="text-xl font-black text-slate-900">
                {isDragActive ? "Relâchez pour envoyer" : "Glissez-déposez vos fichiers ici"}
              </p>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Radiographies, Photos Cliniques ou rapports PDF (Max 10Mo)
              </p>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
         {['ALL', 'PHOTO', 'XRAY', 'DOC'].map(cat => (
           <Button
             key={cat}
             variant={activeCategory === cat ? 'default' : 'outline'}
             onClick={() => setActiveCategory(cat)}
             className="rounded-xl font-bold"
           >
             {cat === 'ALL' ? 'Tout' : cat}
           </Button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-300">
             <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
             <p className="font-bold">Aucun document dans cette catégorie</p>
          </div>
        ) : (
          filteredMedia.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all h-64">
               
               {/* Preview Content */}
               <div className="h-44 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {item.fileType === 'IMAGE' ? (
                    item.signedUrl ? (
                      <img src={item.signedUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
                    )
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                       <FileText className="h-12 w-12" />
                       <span className="text-[10px] font-black uppercase tracking-tighter">DOCUMENT PDF</span>
                    </div>
                  )}
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     {item.signedUrl && (
                       <a href={item.signedUrl} target="_blank" rel="noreferrer">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                           <Maximize2 className="h-4 w-4" />
                        </Button>
                       </a>
                     )}
                     <Button 
                       size="icon" 
                       variant="destructive" 
                       className="rounded-full shadow-lg"
                       onClick={() => handleDelete(item)}
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-4 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-slate-900 truncate text-sm">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
