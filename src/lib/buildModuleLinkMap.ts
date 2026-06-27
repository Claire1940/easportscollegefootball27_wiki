import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  cfb27ReleaseDateEarlyAccess: { field: 'items', nameKey: 'label' },
  cfb27EditionsPreOrder: { field: 'rows', nameKey: 'edition' },
  cfb27TeamRatings: { field: 'topTeams', nameKey: 'team' },
  cfb27DynastyTeamBuilder: { field: 'steps', nameKey: 'title' },
  cfb27RoadToGlory: { field: 'builds', nameKey: 'title' },
  cfb27UltimateTeam: { field: 'rewards', nameKey: 'title' },
  cfb27GameplayControls: { field: 'items', nameKey: 'title' },
  cfb27OnlineModes: { field: 'cards', nameKey: 'title' },
}

// Extra semantic keywords per module to boost matching for h2 titles
// These supplement the module title text when matching against articles
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  cfb27ReleaseDateEarlyAccess: ['release date', 'early access', 'launch', 'platforms', 'ps5', 'xbox series', 'ea app', 'steam', 'epic', 'deluxe edition', 'mvp'],
  cfb27EditionsPreOrder: ['editions', 'deluxe edition', 'standard edition', 'mvp bundle', 'mvp membership', 'mvp plus', 'pre order', 'preorder', 'college football points', 'dynasty coach points', 'road to glory skill points'],
  cfb27TeamRatings: ['team ratings', 'player ratings', 'ratings', 'ovr', 'best teams', 'elite teams', 'oregon', 'tiger stadium', 'dynasty', 'play now'],
  cfb27DynastyTeamBuilder: ['dynasty', 'team builder', 'teambuilder', 'recruiting', 'nil', 'facilities', 'dynasty points', 'coach points', 'coach mode', 'program identity', 'stadium'],
  cfb27RoadToGlory: ['road to glory', 'builds', 'positions', 'training', 'max potential', 'mental abilities', 'cap breakers', 'nil', 'heisman', 'draft stock', 'legacy score', 'quarterback'],
  cfb27UltimateTeam: ['ultimate team', 'college football ultimate team', 'rewards', 'objectives', 'evos', 'programs', 'cornerstones', 'skill points', 'items', 'starter'],
  cfb27GameplayControls: ['gameplay', 'controls', 'playbooks', 'coverage', 'tackle stick', 'wr db battles', 'formations', 'formation disguise', 'coach mode', 'snap', 'catching'],
  cfb27OnlineModes: ['online modes', 'road to cfp', 'college football playoff', 'crossplay', 'cross play', 'head to head', 'competitive', 'playoff', 'cross platform'],
}

const FILLER_WORDS = ['ea', 'sports', 'college', 'football', '27', '2026', '2025', 'complete', 'the', 'and', 'for', 'how', 'with', 'our', 'this', 'your', 'all', 'from', 'learn', 'master']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (stripped of game name "EA Sports College Football 27")
  const strippedQuery = normalizedQuery.replace(/ea sports college football 27\s*/g, '').trim()
  const strippedTitle = normalizedTitle.replace(/ea sports college football 27\s*/g, '').trim()
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 15)
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[]
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`
          linkMap[key] = findBestMatch(itemName, allArticles)
        }
      }
    }
  }

  return linkMap
}
