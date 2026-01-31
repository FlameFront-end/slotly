import { type FC, useRef, useEffect, type ComponentType, useCallback } from 'react'
import { Card, Text, Group, Anchor } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'
import { LocationInfo } from '@/shared/components/LocationInfo'
import { formatSocialLink } from '@/shared/lib/formatting'
import s from './OwnerCard.module.scss'

const SCROLL_DELAY_MS = 700
const DESCRIPTION_LENGTH_THRESHOLD = 150
const SCROLL_OFFSET = 100
const VIEWPORT_HEIGHT_THRESHOLD = 0.9

interface SocialLink {
  type: string
  value: string
  icon: ComponentType<{ size?: string | number; stroke?: string | number }>
}

interface Props {
  name: string
  description?: string
  address?: string
  mapLink?: string
  website?: string
  socialLinks: SocialLink[]
  isDescriptionExpanded: boolean
  onToggleDescription: () => void
}

const scrollToElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  const elementTop = rect.top + window.pageYOffset
  const elementHeight = rect.height
  const windowHeight = window.innerHeight
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  const elementBottom = elementTop + elementHeight
  const viewportBottom = scrollTop + windowHeight
  const isLargeElement = elementHeight > windowHeight * VIEWPORT_HEIGHT_THRESHOLD
  const isOutOfView = elementBottom > viewportBottom

  let scrollTo: number
  if (isLargeElement || isOutOfView) {
    scrollTo = elementTop - SCROLL_OFFSET
  } else {
    scrollTo = elementTop - (windowHeight - elementHeight) / 2
  }

  window.scrollTo({
    top: Math.max(0, scrollTo),
    behavior: 'smooth'
  })
}

interface DescriptionProps {
  description: string
  isExpanded: boolean
  onToggle: () => void
}

const Description: FC<DescriptionProps> = ({ description, isExpanded, onToggle }) => {
  const showExpandButton = description.length > DESCRIPTION_LENGTH_THRESHOLD

  return (
    <div className={s.descriptionWrapper}>
      <Text
        size="sm"
        c="dimmed"
        className={s.ownerDescription}
        lineClamp={isExpanded ? undefined : 3}
      >
        {description}
      </Text>
      {showExpandButton && (
        <span className={s.expandButtonWrapper}>
          <button
            type="button"
            onClick={onToggle}
            className={s.expandButtonInline}
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
        </span>
      )}
    </div>
  )
}

interface SocialLinksProps {
  links: SocialLink[]
}

const SocialLinks: FC<SocialLinksProps> = ({ links }) => {
  if (links.length === 0) return null

  return (
    <Group gap="xs" className={s.socialLinks}>
      {links.map(link => {
        const Icon = link.icon
        return (
          <Anchor
            key={link.type}
            href={formatSocialLink(link.type, link.value)}
            target="_blank"
            rel="noopener noreferrer"
            className={s.socialLink}
          >
            <Icon size={20} stroke={1.5} />
          </Anchor>
        )
      })}
    </Group>
  )
}

export const OwnerCard: FC<Props> = ({
  name,
  description,
  address,
  mapLink,
  website,
  socialLinks,
  isDescriptionExpanded,
  onToggleDescription
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!cardRef.current) return
    scrollToElement(cardRef.current)
  }, [])

  useEffect(() => {
    if (!isDescriptionExpanded) return

    const timeoutId = setTimeout(handleScroll, SCROLL_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [isDescriptionExpanded, handleScroll])

  return (
    <Card className={s.ownerCard} ref={cardRef}>
      <div className={s.ownerCardHeader}>
        <div className={s.ownerIconWrapper}>
          <IconBuilding size={32} stroke={2} />
        </div>
        <div className={s.ownerInfo}>
          <Text fw={700} size="lg" className={s.ownerName}>
            {name}
          </Text>
          {description && (
            <Description
              description={description}
              isExpanded={isDescriptionExpanded}
              onToggle={onToggleDescription}
            />
          )}
        </div>
      </div>

      <div className={s.ownerCardActions}>
        <LocationInfo address={address} mapLink={mapLink} website={website} />
        <SocialLinks links={socialLinks} />
      </div>
    </Card>
  )
}
