import { useEffect, useState } from 'react'
import api from '../services/api'

const EMPTY_CATEGORY = []

export function useCategories() {
  const [categories, setCategories] = useState(EMPTY_CATEGORY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadCategories() {
      try {
        const { data } = await api.get('/categories')
        if (active) setCategories(data)
      } catch {
        if (active) setError('Não foi possível carregar as categorias.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  async function addCategory(name) {
    const trimmed = name.trim()
    if (!trimmed || categories.some((category) => category.name === trimmed)) return null

    const { data } = await api.post('/categories', { name: trimmed })
    setCategories((current) => [...current, data])
    return data
  }

  async function removeCategory(id) {
    await api.delete(`/categories/${id}`)
    setCategories((current) => current.filter((category) => category.id !== id))
  }

  return { categories, loading, error, addCategory, removeCategory }
}
