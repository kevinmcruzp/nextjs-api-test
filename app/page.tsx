'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Cria um AbortController para controlar a requisição
    const controller = new AbortController()
    const signal = controller.signal

    console.log('Iniciando fetch para /api/users...')

    // Faz a requisição passando o signal do controller
    fetch('/api/users', { signal })
      .then(response => response.json())
      .then(data => {
        console.log('Fetch completado com sucesso:', data)
      })
      .catch(err => {
        // O erro 'AbortError' é esperado quando cancelamos
        if (err.name === 'AbortError') {
          console.log('Fetch abortado no cliente!')
        } else {
          console.error('Erro no fetch:', err)
        }
      })

    // Agenda o cancelamento da requisição após 1 segundo
    const timer = setTimeout(() => {
      console.log('Abortando a requisição...')
      controller.abort()
    }, 1000)

    // Função de limpeza: aborta a requisição se o componente for desmontado
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Testando Abort de Requisição</h1>
      <p>Abra o console do navegador e o terminal do servidor para ver os logs.</p>
      <p>A requisição será cancelada após 1 segundo.</p>
    </div>
  )
}
