import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPost } from '../services/post'

function CrearPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await crearPost({
        title: title.trim(),
        content: content.trim(),
      })
      navigate('/posts')
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Crear publicación</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block font-medium">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-1 block font-medium">
            Contenido
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full rounded-xl border p-3"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-violet-600 px-5 py-3 text-white disabled:opacity-60"
        >
          {enviando ? 'Publicando…' : 'Publicar'}
        </button>
      </form>
    </section>
  )
}

export default CrearPost