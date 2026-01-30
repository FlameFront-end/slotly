import { type FC, useRef, useEffect, type ComponentType } from 'react'
import { Card, Text, Group, Anchor } from '@mantine/core'
import { IconBuilding } from '@tabler/icons-react'
import { LocationInfo } from '@/shared/components/LocationInfo'
import { formatSocialLink } from '@/shared/lib/formatting'
import s from './OwnerCard.module.scss'

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
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDescriptionExpanded && descriptionRef.current) {
      const timeoutId = setTimeout(() => {
        const element = descriptionRef.current
        if (!element) return

        const elementRect = element.getBoundingClientRect()
        const elementTop = elementRect.top + window.pageYOffset
        const elementHeight = elementRect.height
        const windowHeight = window.innerHeight
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop

        const elementBottom = elementTop + elementHeight
        const viewportBottom = currentScrollTop + windowHeight

        if (elementHeight > windowHeight * 0.9 || elementBottom > viewportBottom) {
          const scrollTo = elementTop - 100
          window.scrollTo({
            top: Math.max(0, scrollTo),
            behavior: 'smooth'
          })
        } else {
          const scrollTo = elementTop - (windowHeight - elementHeight) / 2
          window.scrollTo({
            top: Math.max(0, scrollTo),
            behavior: 'smooth'
          })
        }
      }, 700)

      return () => clearTimeout(timeoutId)
    }
  }, [isDescriptionExpanded])

  return (
    <Card className={s.ownerCard} padding={0} radius="md" withBorder={false} ref={descriptionRef}>
      <div className={s.ownerCardHeader}>
        <div className={s.ownerIconWrapper}>
          <IconBuilding size={32} stroke={2} />
        </div>
        <Text fw={700} size="lg" className={s.ownerName}>{name}</Text>
      </div>
      {description && (
        <>
          <div className={s.descriptionWrapper}>
            <Text
              size="sm"
              c="dimmed"
              className={s.ownerDescription}
              lineClamp={isDescriptionExpanded ? undefined : 3}
            >
              {description}
            </Text>
            {description.length > 150 && (
              <span className={s.expandButtonWrapper}>
                <button
                  type="button"
                  onClick={onToggleDescription}
                  className={s.expandButtonInline}
                >
                  {isDescriptionExpanded ? 'Свернуть' : 'Развернуть'}
                </button>
              </span>
            )}
          </div>
        </>
      )}
      <LocationInfo address={address} mapLink={mapLink} website={website} />
      {socialLinks.length > 0 && (
        <Group gap="xs" mt="md" className={s.socialLinks}>
          {socialLinks.map(link => {
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
      )}
    </Card>
  )
}
