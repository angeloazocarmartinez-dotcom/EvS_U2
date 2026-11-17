import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerPosts, reaccionarPost } from '../services/post'

const tiposReaccion = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Me divierte' },
  { type: 'wow', emoji: '😮', label: 'Me sorprende' },
  { type: 'sad', emoji: '😢', label: 'Me entristece' },
  { type: 'angry', emoji: '😡', label: 'Me enoja' },
]

function formatearFecha(fecha) {
  const fechaValida = new Date(fecha)

  if (!fecha || Number.isNaN(fechaValida.getTime())) {
    return 'Fecha desconocida'
  }

  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(fechaValida)
}

function Publicaciones() {
  const [posts, setPosts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorReaccion, setErrorReaccion] = useState('')

  useEffect(() => {
    let activa = true

    obtenerPosts()
      .then((resultado) => {
        if (activa) setPosts(resultado)
      })
      .catch((e) => {
        if (activa) setError(e.message)
      })
      .finally(() => {
        if (activa) setCargando(false)
      })
    

    return () => {
      activa = false
    }
   }, [])

  async function handleReaccion(postId, type) {
    setErrorReaccion('')

    try {
      const counts = await reaccionarPost(postId, type)
      setPosts((actuales) =>
        actuales.map((post) =>
          post.id === postId ? { ...post, reactions: counts } : post,
        ),
      )
    } catch (e) {
      setErrorReaccion(e.message)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Publicaciones</h1>
        <p className="mt-2 text-neutral-500">
          Preguntas, ideas y recursos de la clase.
        </p>

        <Link
          to="/crear-post"
          className="mt-4 inline-block rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white"
        >
          Crear publicación
        </Link>
      </header>

      {cargando && <p>Cargando publicaciones…</p>}

      {!cargando && error && (
        <p className="text-red-600">Error: {error}</p>
      )}
      {errorReaccion && (
  <p role="alert" className="text-sm text-red-600">
    {errorReaccion}
  </p>
)}

      {!cargando && !error && posts.length === 0 && (
        <p>Todavía no hay publicaciones.</p>
      )}

      {!cargando && !error && posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">{post.title}</h2>

          <p className="mt-3 whitespace-pre-wrap text-neutral-700">
            {post.content}
          </p>

          <p className="mt-4 text-sm text-neutral-500">
            Por {post.author?.name || 'Autor desconocido'} ·{' '}
            {formatearFecha(post.createdAt)}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
  {tiposReaccion.map(({ type, emoji, label }) => (
    <button
      key={type}
      type="button"
      title={label}
      aria-label={`${label}: ${post.reactions?.[type] ?? 0}`}
      onClick={() => handleReaccion(post.id, type)}
      className="rounded-full bg-violet-50 px-3 py-1 hover:bg-violet-100"
    >
      {emoji} {post.reactions?.[type] ?? 0}
    </button>
  ))}
</div>
        </article>
      ))}
    </section>
  )
}

export default Publicaciones