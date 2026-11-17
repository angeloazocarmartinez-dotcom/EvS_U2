const API_URL = import.meta.env.VITE_API_URL

export async function crearPost({ title, content }) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('No hay una sesión activa. Inicia sesión para publicar.')
  }

  const respuesta = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo crear la publicación')
  }

  return datos.post
}

export async function obtenerPosts() {
  const respuesta = await fetch(`${API_URL}/posts`)
  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudieron cargar las publicaciones')
  }

  return datos.posts
}

export async function reaccionarPost(postId, type) {
  const usuario = JSON.parse(localStorage.getItem('user') || 'null')
  const body = {
    type,
    ...(usuario?.id ? { userId: usuario.id } : {}),
  }

  const respuesta = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const datos = await respuesta.json()

  if (respuesta.status === 409) {
    throw new Error('Ya reaccionaste a esta publicación con ese tipo.')
  }

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo registrar la reacción')
  }

  return datos.counts
}