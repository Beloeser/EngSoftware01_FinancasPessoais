import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import {
  Container,
  PageTitle,
  FormTitle,
  Input,
  ErrorMessage,
} from '../Dashboard/Styles'
import {
  CategoryList,
  CategoryItem,
  CategoryName,
  RemoveButton,
  EmptyText,
} from './Styles'

export default function Categories() {
  const { categories, error: loadError, addCategory, removeCategory } = useCategories()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Informe o nome da categoria.')
      return
    }
    if (categories.some((category) => category.name === name.trim())) {
      setError('Categoria já cadastrada.')
      return
    }
    try {
      await addCategory(name)
      setName('')
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar categoria.')
    }
  }

  return (
    <Container>
      <PageTitle>Categorias</PageTitle>

      <Card>
        <FormTitle>Nova Categoria</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Nome da categoria *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit">Adicionar</Button>
        </form>
      </Card>

      {loadError && <ErrorMessage>{loadError}</ErrorMessage>}
      <CategoryList>
        {categories.length === 0 && (
          <EmptyText>Nenhuma categoria cadastrada.</EmptyText>
        )}
        {categories.map((cat) => (
          <CategoryItem key={cat.id}>
            <CategoryName>{cat.name}</CategoryName>
            <RemoveButton type="button" onClick={() => removeCategory(cat.id)}>
              Remover
            </RemoveButton>
          </CategoryItem>
        ))}
      </CategoryList>
    </Container>
  )
}
