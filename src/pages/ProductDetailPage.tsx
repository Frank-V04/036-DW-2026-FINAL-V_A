import { Link, useParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useProduct } from '../hooks/useProducts'
import { getErrorMessage } from '../utils/errorHandler'
import { fichaText } from '../utils/ficha'
import type { Product } from '../types'

// TODO 3.2: descarga la imagen como blob
async function downloadImage(item: Product) {
  try {
    const response = await axios.get<Blob>(item.thumbnail, { responseType: 'blob' })
    const blob = response.data
    const ext = blob.type.split('/')[1] ?? 'webp'
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `producto-${item.id}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    toast.error(getErrorMessage(err))
  }
}

// TODO 3.3: descarga la ficha de texto
function downloadFicha(item: Product) {
  const text = fichaText(item)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `producto-${item.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function ProductDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useProduct(Number(id))

  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/productos" className="text-sm font-medium text-brand-700 hover:underline">
        ← Volver al listado
      </Link>

      {isLoading && <p className="mt-6 text-slate-500" role="status">Cargando…</p>}

      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      {data && (
        <article className="mt-4 grid gap-4 sm:grid-cols-2">
          <img src={data.thumbnail} alt={data.title}
            className="w-full rounded-xl bg-slate-100 object-contain" />
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wide text-brand-700">{data.category}</span>
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p className="text-xl font-bold">${data.price.toFixed(2)}</p>
            <p className="text-sm text-slate-600">{data.description}</p>
            <p className="text-sm">Stock: {data.stock} · Valoración: {data.rating}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => downloadImage(data)}>Descargar imagen</Button>
              <Button variant="outline" onClick={() => downloadFicha(data)}>Descargar ficha</Button>
            </div>
          </div>
        </article>
      )}
    </main>
  )
}

export default ProductDetailPage