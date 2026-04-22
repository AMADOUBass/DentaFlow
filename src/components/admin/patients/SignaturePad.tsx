'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser, Check, ShieldCheck } from 'lucide-react'

interface SignaturePadProps {
  onSave: (signatureData: string) => void
  onClear?: () => void
}

export function SignaturePad({ onSave, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
  }, [])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    setIsEmpty(false)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setIsEmpty(true)
      onClear?.()
    }
  }

  const save = () => {
    if (isEmpty) return
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      onSave(dataUrl)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-crosshair touch-none group-hover:border-primary/30 transition-colors"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-medium italic">
            Signez ici avec votre doigt ou un stylet
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-600">
           <ShieldCheck className="h-4 w-4" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sécurisé & Certifié Loi 25</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-2xl gap-2 font-bold text-slate-500" onClick={clear}>
            <Eraser className="h-4 w-4" /> Effacer
          </Button>
          <Button className="rounded-2xl gap-2 bg-slate-900 font-black shadow-xl shadow-slate-200" onClick={save} disabled={isEmpty}>
            <Check className="h-4 w-4" /> Valider la signature
          </Button>
        </div>
      </div>
    </div>
  )
}
