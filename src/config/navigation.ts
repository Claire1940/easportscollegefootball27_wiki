import type { LucideIcon } from 'lucide-react'
import { Calendar, Monitor, ShoppingCart, BookOpen, Trophy, Star } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'release' -> t('nav.release')
	path: string // URL 路径，如 '/release'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：EA Sports College Football 27 内容分类（6 类）
// release 发售信息 / platforms 平台 / buy 购买版本 / guide 攻略 / dynasty 王朝模式 / ratings 评分
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: Calendar, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: Monitor, isContentType: true },
	{ key: 'buy', path: '/buy', icon: ShoppingCart, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'dynasty', path: '/dynasty', icon: Trophy, isContentType: true },
	{ key: 'ratings', path: '/ratings', icon: Star, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['release', 'platforms', 'buy', 'guide', 'dynasty', 'ratings']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
