import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'

interface ImageInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageInput({ value, onChange, label = 'Image' }: ImageInputProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('cms-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('cms-images').getPublicUrl(fileName)
      onChange(data.publicUrl)
    } catch {
      setError('Échec du téléversement')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-olive-700 mb-1">{label}</label>
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL de l'image"
          className="flex-1 rounded-lg border border-olive-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-sm py-2 px-4 whitespace-nowrap disabled:opacity-50"
        >
          {uploading ? '...' : 'Téléverser'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="text-brick-600 text-xs mt-1">{error}</p>}
      {value && (
        <img src={value} alt="Aperçu" className="mt-2 w-24 h-24 object-cover rounded-lg border border-olive-200" />
      )}
    </div>
  )
}
