import { type FC, useState, useEffect, useRef } from 'react'
import { Container, Title, Text, Group, Stack, Card, ThemeIcon, Grid, Box, Badge, ActionIcon } from '@mantine/core'
import { IconCalendar, IconClock, IconUsers, IconCheck, IconArrowRight, IconShield, IconDeviceMobile, IconChartBar, IconSparkles, IconRocket, IconTrendingUp, IconChevronLeft, IconChevronRight, IconBolt, IconHandshake, IconHeart } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/shared/kit'
import { ROUTES } from '@/shared/model/routes'

import s from './Landing.module.scss'

const Landing: FC = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const slides = [
    {
      icon: IconCalendar,
      title: 'Простота использования',
      description: 'Настройте свой профиль и расписание за несколько минут. Никаких сложных настроек и долгого обучения.'
    },
    {
      icon: IconRocket,
      title: 'Быстрый старт',
      description: 'Начните принимать записи уже сегодня. Интуитивный интерфейс позволяет разобраться без инструкций.'
    },
    {
      icon: IconUsers,
      title: 'Поддержка клиентов',
      description: 'Ваши клиенты оценят удобство онлайн-записи. Они могут выбрать удобное время в любое время суток.'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, slides.length])

  const features = [
    {
      icon: IconCalendar,
      title: 'Управление расписанием',
      description: 'Создавайте гибкое расписание с учетом рабочих дней, праздников и особых дат. Настройте доступные слоты за минуты.'
    },
    {
      icon: IconClock,
      title: 'Онлайн-бронирование',
      description: 'Ваши клиенты могут записываться на удобное время 24/7. Никаких звонков и ожидания ответа.'
    },
    {
      icon: IconUsers,
      title: 'Управление записями',
      description: 'Просматривайте все записи, управляйте их статусами, получайте уведомления о новых бронированиях.'
    },
    {
      icon: IconShield,
      title: 'Безопасность данных',
      description: 'Все данные защищены и хранятся безопасно. Вы контролируете, кто видит ваш профиль и расписание.'
    },
    {
      icon: IconDeviceMobile,
      title: 'Мобильная версия',
      description: 'Работайте с любого устройства. Адаптивный дизайн обеспечивает комфортную работу на смартфоне и планшете.'
    },
    {
      icon: IconChartBar,
      title: 'Аналитика',
      description: 'Отслеживайте статистику записей, популярные услуги и временные слоты для оптимизации работы.'
    }
  ]

  const benefits = [
    'Экономия времени на обработке запросов',
    'Уменьшение количества пропущенных звонков',
    'Профессиональный имидж для вашего бизнеса',
    'Автоматизация рутинных процессов',
    'Удобство для клиентов - запись в любое время',
    'Снижение нагрузки на администраторов'
  ]

  return (
    <div className={s.landing}>
      {/* Hero Section */}
      <section className={s.hero}>
        <div className={s.heroBackground}>
          <div className={s.heroGradient1}></div>
          <div className={s.heroGradient2}></div>
          <div className={s.heroGradient3}></div>
        </div>

        <Container size="xl" className={s.heroContainer}>
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg" className={s.heroContent}>
                <Badge size="lg" className={s.heroBadge} variant="light" color="blue">
                  <span className={s.badgeContent}>
                    <IconSparkles size={16} className={s.badgeIcon} />
                    <span className={s.badgeText}>Новое поколение онлайн-бронирования</span>
                  </span>
                </Badge>

                <Title order={1} className={s.heroTitle}>
                  Автоматизируйте записи и
                  <br />
                  <span className={s.heroTitleAccent}>растите быстрее</span>
                </Title>

                <Text size="lg" className={s.heroDescription}>
                  Современная платформа для управления расписанием и приема онлайн-записей.
                  Экономьте до 10 часов в неделю, автоматизируя рутинные задачи.
                </Text>

                <Group gap="md" className={s.heroStats}>
                  <Box className={s.statItem}>
                    <IconTrendingUp size={24} className={s.statIcon} />
                    <Text fw={700} size="xl">+300%</Text>
                    <Text size="sm" c="dimmed">рост записей</Text>
                  </Box>
                  <Box className={s.statItem}>
                    <IconClock size={24} className={s.statIcon} />
                    <Text fw={700} size="xl">10ч</Text>
                    <Text size="sm" c="dimmed">экономии в неделю</Text>
                  </Box>
                  <Box className={s.statItem}>
                    <IconRocket size={24} className={s.statIcon} />
                    <Text fw={700} size="xl">5 мин</Text>
                    <Text size="sm" c="dimmed">на настройку</Text>
                  </Box>
                </Group>

                <Group gap="md" className={s.heroActions}>
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    rightSection={<IconArrowRight size={20} />}
                    className={s.heroButtonPrimary}
                  >
                    Начать бесплатно
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className={s.heroButtonSecondary}
                  >
                    Войти
                  </Button>
                </Group>

                <Text size="sm" c="dimmed" className={s.heroNote}>
                  ✓ Без кредитной карты • ✓ Настройка за 5 минут • ✓ Бесплатная поддержка
                </Text>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box className={s.heroVisual}>
                <Card className={s.heroMockup} padding="xl" radius="lg">
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <ThemeIcon size={40} radius="md" className={s.mockupIcon}>
                          <IconCalendar size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="lg">Slotly</Text>
                      </Group>
                      <Badge color="green" size="sm">Онлайн</Badge>
                    </Group>

                    <Box className={s.mockupCalendar}>
                      <Grid>
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <Grid.Col key={day} span={12 / 7}>
                            <Box className={s.mockupDay} data-active={day === 3}>
                              <Text size="xs" fw={day === 3 ? 700 : 400}>
                                {day}
                              </Text>
                            </Box>
                          </Grid.Col>
                        ))}
                      </Grid>
                    </Box>

                    <Stack gap="xs">
                      {[{ time: '09:00', name: 'Иван Петров' }, { time: '11:00', name: 'Мария Сидорова' }, { time: '14:00', name: 'Алексей Иванов' }].map((booking, idx) => (
                        <Group key={idx} className={s.mockupBooking} justify="space-between">
                          <Group gap="sm">
                            <ThemeIcon size={32} radius="sm" variant="light" color="blue">
                              <IconClock size={16} />
                            </ThemeIcon>
                            <Box>
                              <Text size="sm" fw={500}>{booking.time}</Text>
                              <Text size="xs" c="dimmed">{booking.name}</Text>
                            </Box>
                          </Group>
                          <Badge size="sm" color="blue" variant="light">Подтверждено</Badge>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </Card>

                <div className={s.heroFloatingCard1}>
                  <IconUsers size={32} />
                  <Text fw={600}>500+</Text>
                  <Text size="xs" c="dimmed">активных пользователей</Text>
                </div>

                <div className={s.heroFloatingCard2}>
                  <IconCheck size={24} className={s.heroFloatingCard2Icon} />
                  <Text fw={600} className={s.heroFloatingCard2Percent}>98%</Text>
                  <Text size="xs" className={s.heroFloatingCard2Text}>довольных клиентов</Text>
                </div>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className={s.features}>
        <Container size="lg">
          <Stack gap="xl" align="center" className={s.sectionHeader}>
            <Title order={2} className={s.sectionTitle}>
              Все необходимое для управления записями
            </Title>
            <Text size="lg" className={s.sectionDescription}>
              Мощные инструменты в простом и интуитивном интерфейсе
            </Text>
          </Stack>

          <Grid gutter="xl" className={s.featuresGrid}>
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <Card className={s.featureCard} padding="xl" radius="md">
                  <ThemeIcon size={56} radius="md" className={s.featureIcon}>
                    <feature.icon size={28} stroke={1.5} />
                  </ThemeIcon>
                  <Title order={3} className={s.featureTitle}>
                    {feature.title}
                  </Title>
                  <Text className={s.featureDescription}>
                    {feature.description}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className={s.benefits}>
        <Container size="lg">
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="lg">
                <Title order={2} className={s.sectionTitle}>
                  Почему выбирают Slotly?
                </Title>
                <Text size="lg" className={s.sectionDescription}>
                  Мы помогаем бизнесу расти, автоматизируя процесс бронирования и экономя ваше время.
                </Text>
                <Stack gap="md" className={s.benefitsList}>
                  {benefits.map((benefit, index) => (
                    <Group key={index} gap="sm" align="flex-start">
                      <ThemeIcon size={24} radius="md" className={s.benefitIcon}>
                        <IconCheck size={16} stroke={2} />
                      </ThemeIcon>
                      <Text className={s.benefitText}>{benefit}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box
                className={s.benefitsVisual}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Box className={s.sliderContainer}>
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    className={s.sliderButton}
                    onClick={prevSlide}
                    aria-label="Предыдущий слайд"
                  >
                    <IconChevronLeft size={24} />
                  </ActionIcon>

                  <Box className={s.sliderWrapper}>
                    <Box
                      className={s.sliderTrack}
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                      }}
                    >
                      {slides.map((slide, index) => {
                        const IconComponent = slide.icon
                        return (
                          <Card
                            key={index}
                            className={`${s.visualCard} ${index === currentSlide ? s.slideActive : ''}`}
                            padding="xl"
                            radius="md"
                          >
                            <Stack gap="lg" align="center" className={s.visualContent}>
                              <Box className={s.visualIconWrapper}>
                                <ThemeIcon size={96} radius="md" className={s.visualIconBg}>
                                  <IconComponent size={48} stroke={1.5} className={s.visualIcon} />
                                </ThemeIcon>
                              </Box>
                              <Box className={s.visualTextWrapper}>
                                <Title order={3} className={s.visualTitle}>{slide.title}</Title>
                                <Text ta="center" className={s.visualText}>
                                  {slide.description}
                                </Text>
                              </Box>
                            </Stack>
                          </Card>
                        )
                      })}
                    </Box>
                  </Box>

                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    className={s.sliderButton}
                    onClick={nextSlide}
                    aria-label="Следующий слайд"
                  >
                    <IconChevronRight size={24} />
                  </ActionIcon>
                </Box>

                <Group gap="xs" justify="center" className={s.sliderIndicators}>
                  {slides.map((_, index) => (
                    <Box
                      key={index}
                      className={`${s.indicator} ${index === currentSlide ? s.indicatorActive : ''}`}
                      onClick={() => goToSlide(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          goToSlide(index)
                        }
                      }}
                      aria-label={`Перейти к слайду ${index + 1}`}
                    />
                  ))}
                </Group>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={s.cta}>
        <Container size="lg">
          <Box className={s.ctaWrapper}>
            <Card className={s.ctaCard} padding="xl" radius="lg">
              <Stack gap="xl" align="center" className={s.ctaContent}>
                <Box className={s.ctaHeader}>
                  <Title order={2} className={s.ctaTitle}>
                    Готовы начать?
                  </Title>
                  <Text size="lg" className={s.ctaDescription}>
                    Присоединяйтесь к Slotly сегодня и начните принимать онлайн-записи уже завтра.
                  </Text>
                </Box>

                <Group gap="md" className={s.ctaActions}>
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    className={s.ctaButtonPrimary}
                    rightSection={<IconArrowRight size={20} stroke={2} />}
                  >
                    Создать аккаунт
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className={s.ctaButtonSecondary}
                  >
                    Войти в систему
                  </Button>
                </Group>

                <Group gap="lg" className={s.ctaFeatures}>
                  <Group gap="xs" className={s.ctaFeature}>
                    <IconCheck size={18} className={s.ctaFeatureIcon} />
                    <Text size="sm" c="dimmed">Без кредитной карты</Text>
                  </Group>
                  <Group gap="xs" className={s.ctaFeature}>
                    <IconCheck size={18} className={s.ctaFeatureIcon} />
                    <Text size="sm" c="dimmed">Настройка за 5 минут</Text>
                  </Group>
                  <Group gap="xs" className={s.ctaFeature}>
                    <IconCheck size={18} className={s.ctaFeatureIcon} />
                    <Text size="sm" c="dimmed">Бесплатная поддержка</Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
          </Box>
        </Container>
      </section>
    </div>
  )
}

export const Component = Landing
