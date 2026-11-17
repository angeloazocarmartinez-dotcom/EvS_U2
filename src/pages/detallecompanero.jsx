import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerUsuarioPorId } from '../services/usuario'

function iniciales(usuario) {
  const nombre = usuario.name?.[0] ?? ''
  const apellido = usuario.lastName?.[0] ?? ''
  return (nombre + apellido).toUpperCase() || '?'
}

function formatearFecha(fecha) {
  if (!fecha) return 'No disponible'

  const fechaValida = new Date(fecha)
  if (Number.isNaN(fechaValida.getTime())) return 'No disponible'

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(fechaValida)
}

function DetalleCompanero() {
  const { id } = useParams()
  const [resultado, setResultado] = useState(null)
  const [intento, setIntento] = useState(0)
  const claveSolicitud = `${id ?? ''}:${intento}`

  useEffect(() => {
    let activo = true

    Promise.resolve()
      .then(() => {
        if (!id) throw new Error('No se indicó el identificador del compañero')
        return obtenerUsuarioPorId(id)
      })
      .then((datos) => {
        if (activo) setResultado({ clave: claveSolicitud, usuario: datos, error: null })
      })
      .catch((e) => {
        if (activo) setResultado({ clave: claveSolicitud, usuario: null, error: e.message })
      })

    return () => {
      activo = false
    }
  }, [id, claveSolicitud])

  const cargando = resultado?.clave !== claveSolicitud
  const usuario = cargando ? null : resultado.usuario
  const error = cargando ? null : resultado.error

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-6">
        <div className="h-5 w-36 rounded bg-neutral-200" />
        <div className="rounded-3xl border border-neutral-200 bg-white p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-24 w-24 rounded-full bg-neutral-200" />
            <div className="space-y-3">
              <div className="h-6 w-48 rounded bg-neutral-200" />
              <div className="h-4 w-36 rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !usuario) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-xl font-semibold text-red-800">
          No se pudo cargar el compañero
        </h1>
        <p className="mt-2 text-sm text-red-600">
          {error || 'No se encontró la información del compañero.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/mis-companeros"
            className="rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Volver a compañeros
          </Link>
          {error && (
            <button
              onClick={() => setIntento((actual) => actual + 1)}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    )
  }

  const publicaciones = usuario.posts ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/mis-companeros"
        className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition-colors hover:text-violet-900"
      >
        <span aria-hidden="true">←</span>
        Volver a compañeros
      </Link>

      <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400" />
        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-600 to-fuchsia-500 text-3xl font-bold text-white shadow-md">
              {iniciales(usuario)}
            </div>
            <div className="pb-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                {usuario.name} {usuario.lastName}
              </h1>
              <p className="mt-1 text-sm text-neutral-500">Perfil de compañero</p>
            </div>
          </div>

          <dl className="mt-8 grid gap-5 border-t border-neutral-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                Correo electrónico
              </dt>
              <dd className="mt-1 break-words text-sm font-medium text-neutral-800">
                {usuario.email || 'No disponible'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                RUT
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {usuario.rut || 'No disponible'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                Fecha de registro
              </dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {formatearFecha(usuario.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                Identificador
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-neutral-600">
                {usuario.id || id}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Publicaciones
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {publicaciones.length}{' '}
              {publicaciones.length === 1 ? 'publicación' : 'publicaciones'}
            </p>
          </div>
        </div>

        {publicaciones.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            Este compañero todavía no tiene publicaciones.
          </div>
        ) : (
          <div className="space-y-4">
            {publicaciones.map((publicacion) => (
              <article
                key={publicacion.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {publicacion.title}
                </h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600">
                  {publicacion.content}
                </p>
                <p className="mt-5 border-t border-neutral-100 pt-3 text-xs text-neutral-400">
                  Publicado el {formatearFecha(publicacion.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default DetalleCompanero
