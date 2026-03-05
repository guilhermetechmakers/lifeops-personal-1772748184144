/**
 * Content score computation - completeness, relevance, readability, engagement
 */

export interface ContentScoreResult {
  completeness: number
  relevance: number
  readability: number
  engagementPotential: number
  overall: number
  recommendations: string[]
}

export function computeContentScore(
  title: string,
  content: string,
  seoKeywords: string[] = []
): ContentScoreResult {
  const recommendations: string[] = []
  const titleLen = (title ?? '').trim().length
  const contentLen = (content ?? '').trim().length
  const words = (content ?? '').split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const sentences = (content ?? '').split(/[.!?]+/).filter(Boolean).length
  const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0

  let completeness = 0
  if (titleLen >= 6 && titleLen <= 120) completeness += 25
  else if (titleLen > 0) recommendations.push('Title should be 6-120 characters')
  if (contentLen >= 20) completeness += 25
  else if (contentLen > 0) recommendations.push('Content should be at least 20 characters')
  if (wordCount >= 100) completeness += 25
  else if (wordCount > 0) recommendations.push('Consider adding more content (100+ words recommended)')
  const hasImages = /!\[.*?\]\(.*?\)|<img/i.test(content ?? '')
  if (hasImages) completeness += 25
  else recommendations.push('Add images to improve engagement')

  const readability = Math.min(
    100,
    Math.max(0, 100 - Math.abs(avgWordsPerSentence - 15) * 2)
  )
  if (readability < 60) recommendations.push('Use shorter sentences for better readability')

  const keywordCount = seoKeywords.length
  const contentLower = (content ?? '').toLowerCase()
  const keywordMatches = seoKeywords.filter((kw) =>
    contentLower.includes((kw ?? '').toLowerCase())
  ).length
  const relevance = keywordCount > 0
    ? Math.min(100, (keywordMatches / keywordCount) * 100)
    : 70

  let engagementPotential = 50
  if (wordCount >= 300) engagementPotential += 15
  if (hasImages) engagementPotential += 15
  if (/[?!]/.test(content ?? '')) engagementPotential += 10
  if (/\d+/.test(content ?? '')) engagementPotential += 10
  engagementPotential = Math.min(100, engagementPotential)

  const overall = Math.round(
    (completeness + relevance + readability + engagementPotential) / 4
  )

  return {
    completeness,
    relevance,
    readability,
    engagementPotential,
    overall,
    recommendations,
  }
}
