import axios from 'axios'

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocurrió un error'

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Sin conexión. Verifique su red e intente de nuevo.'
    }
    const status = error.response.status
    const msg = (error.response.data as { message?: string })?.message
    if (status === 400) return msg ?? 'Solicitud inválida.'
    if (status === 401) return 'No autorizado. Inicie sesión nuevamente.'
    if (status === 403) return 'No tiene permisos para realizar esta acción.'
    if (status === 404) return msg ?? 'Recurso no encontrado.'
    if (status >= 500) return 'Error del servidor. Intente más tarde.'
    return msg ?? `Error ${status}.`
  }

  if (error instanceof Error) return error.message
  return 'Ocurrió un error inesperado.'
}