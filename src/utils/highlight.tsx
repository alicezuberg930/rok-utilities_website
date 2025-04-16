export const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text
  const escapedKeywords = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeywords})`, 'gi')
  return text.split(regex).map((part, index) =>
    regex.test(part) ? <mark key={index} style={{ backgroundColor: 'yellow' }}>{part}</mark> : part
  )
}
