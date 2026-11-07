import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useCreateProduct } from '../hooks/useProducts'

const MAX_IMAGE_BYTES = 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png']

const schema = z.object({
  title: z.string().min(3, 'El título necesita al menos 3 caracteres'),
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor que 0'),
  description: z.string().min(10, 'La descripción necesita al menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

interface Props {
  onClose: () => void
}

function ProductForm({ onClose }: Props) {
  const create = useCreateProduct()
  const [fileError, setFileError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  })

  // Liberar URL de vista previa al desmontar o cambiar
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const elegirArchivo = (f: File | undefined) => {
    setFileError(null)
    if (!f) return
    if (!IMAGE_TYPES.includes(f.type)) {
      setFileError('Solo se aceptan imágenes JPG o PNG.')
      return
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setFileError('La imagen no puede superar 1 MB.')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
    setFile(f)
  }

  const onSubmit = (values: FormData) => {
    const body = new FormData()
    body.append('title', values.title)
    body.append('price', String(values.price))
    body.append('description', values.description)
    if (file) body.append('image', file)
    create.mutate(body, { onSuccess: onClose })
  }

  const field =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-600'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-full w-full max-w-lg space-y-3 overflow-y-auto rounded-xl bg-white p-5"
      >
        <h2 id="form-title" className="text-lg font-bold">Nuevo producto</h2>

        <div>
          <label htmlFor="title" className="text-sm font-medium">Título</label>
          <input id="title" type="text" className={field} {...register('title')} />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="price" className="text-sm font-medium">Precio</label>
          <input id="price" type="number" step="0.01" className={field} {...register('price')} />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium">Descripción</label>
          <textarea id="description" rows={3} className={field} {...register('description')} />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="text-sm font-medium">
            Imagen (JPG o PNG, máx. 1 MB)
          </label>
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png"
            className="mt-1 block w-full text-sm"
            onChange={(e) => elegirArchivo(e.target.files?.[0])}
          />
          {fileError && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}
          {preview && (
            <img
              src={preview}
              alt="Vista previa de la imagen elegida"
              className="mt-2 h-24 rounded-lg object-contain"
            />
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={create.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm