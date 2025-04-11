
export function analyzePriority(text: string): number {
  const urgentKeywords = ['urgent', 'asap', 'important', 'critical', 'crucial', 'priority']
  const lowPriorityKeywords = ['maybe', 'sometime', 'eventually', 'later', 'when possible']
  
  const lowerText = text.toLowerCase()
  
  // Check for explicit markers
  if (text.startsWith('!!! ')) return 1
  if (text.startsWith('!! ')) return 2
  if (text.startsWith('! ')) return 3
  
  // Check for urgent keywords
  if (urgentKeywords.some(keyword => lowerText.includes(keyword))) return 1
  
  // Check for low priority keywords
  if (lowPriorityKeywords.some(keyword => lowerText.includes(keyword))) return 3
  
  // Default to medium priority
  return 2
}

export function cleanTaskText(text: string): string {
  return text
    .replace(/^!!! /, '')
    .replace(/^!! /, '')
    .replace(/^! /, '')
    .trim()
}