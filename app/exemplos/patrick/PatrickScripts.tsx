'use client'

import { useEffect } from 'react'

export default function PatrickScripts() {
  useEffect(() => {
    const yearCopy = document.getElementById('year-copy')
    if (yearCopy) {
      yearCopy.textContent = '© ' + new Date().getFullYear() + ' Patrick Serviços Gerais'
    }

    const fotosInput = document.getElementById('fotos') as HTMLInputElement | null
    const fileList = document.getElementById('file-list')

    function handleFotosChange() {
      if (!fotosInput || !fileList) return
      const names = Array.from(fotosInput.files ?? [])
        .map((f) => f.name)
        .join(', ')
      fileList.textContent = names ? 'Selecionadas: ' + names : ''
    }

    fotosInput?.addEventListener('change', handleFotosChange)

    const form = document.getElementById('orcamento-form') as HTMLFormElement | null

    function handleSubmit(e: Event) {
      e.preventDefault()
      const nome = (document.getElementById('nome') as HTMLInputElement | null)?.value.trim() ?? ''
      const bairro = (document.getElementById('bairro') as HTMLInputElement | null)?.value.trim() ?? ''
      const servico = (document.getElementById('servico') as HTMLSelectElement | null)?.value ?? ''
      const descricao = (document.getElementById('descricao') as HTMLTextAreaElement | null)?.value.trim() ?? ''
      const temFotos = (fotosInput?.files?.length ?? 0) > 0
      let msg = `Olá! Meu nome é ${nome}, moro em ${bairro}.\nPreciso de: ${servico}\nDescrição: ${descricao}`
      if (temFotos) {
        msg += `\n\n(Vou anexar as fotos aqui na conversa em seguida)`
      }
      window.open('https://wa.me/554891158924?text=' + encodeURIComponent(msg), '_blank')
    }

    form?.addEventListener('submit', handleSubmit)

    return () => {
      fotosInput?.removeEventListener('change', handleFotosChange)
      form?.removeEventListener('submit', handleSubmit)
    }
  }, [])

  return null
}
