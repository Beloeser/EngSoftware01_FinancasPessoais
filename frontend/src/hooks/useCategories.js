import { useState } from 'react'

const STORAGE_KEY = 'categories'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function useCategories() {
  const [categories, setCategories] = useState(load)

  function addCategory(name) {
    const trimmed = name.trim()
    if (!trimmed || categories.includes(trimmed)) return
    const updated = [...categories, trimmed]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setCategories(updated)
  }

  function removeCategory(name) {
    const updated = categories.filter((c) => c !== name)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setCategories(updated)
  }

  return { categories, addCategory, removeCategory }
}
