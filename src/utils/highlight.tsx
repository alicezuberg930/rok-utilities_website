export const highlightText = (text: string, keyword: string) => {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.split(regex).map((part, index) =>
    regex.test(part) ? <mark key={index} style={{ backgroundColor: 'yellow' }}>{part}</mark> : part
  )
}
