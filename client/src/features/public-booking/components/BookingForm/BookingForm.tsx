import { type FC, useMemo, useState, useCallback, type ComponentType } from 'react'
import { Card, Stack, Group, Text, Select, Radio, Divider, ActionIcon } from '@mantine/core'
import { IconCalendar, IconClock, IconUser, IconCheck, IconChevronLeft, IconChevronRight, IconBriefcase } from '@tabler/icons-react'
import { Button, Input } from '@/shared/kit'
import { createServiceSelectOptions } from '@/shared/utils/service.utils'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import s from './BookingForm.module.scss'

dayjs.locale('ru')

interface ContactMethod {
  type: 'telegram' | 'email' | 'phone' | 'whatsapp'
  value: string
  label: string
  icon: ComponentType<{ size?: string | number; stroke?: string | number }>
}

interface TimeOption {
  value: string
  label: string
}

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | null
}

interface Props {
  selectedDate: string
  selectedTime: string
  selectedServiceId: string
  clientName: string
  selectedContactMethod: string
  clientContact: string
  contactError: string
  availableDates: string[]
  availableTimes: string[]
  availableTimesWithEnd: TimeOption[]
  availableContactMethods: ContactMethod[]
  services: Service[]
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  onServiceChange: (value: string) => void
  onNameChange: (value: string) => void
  onContactMethodChange: (value: string) => void
  onContactChange: (value: string) => void
  onContactBlur: () => void
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
}

export const BookingForm: FC<Props> = ({
  selectedDate,
  selectedTime,
  selectedServiceId,
  clientName,
  selectedContactMethod,
  clientContact,
  contactError,
  availableDates,
  availableTimes,
  availableTimesWithEnd,
  availableContactMethods,
  services,
  onDateChange,
  onTimeChange,
  onServiceChange,
  onNameChange,
  onContactMethodChange,
  onContactChange,
  onContactBlur,
  onSubmit,
  isPending
}) => {
  const getContactLabel = useCallback((method: string): string => {
    const labels: Record<string, string> = {
      telegram: 'Ваш Telegram',
      email: 'Ваш Email',
      phone: 'Ваш телефон',
      whatsapp: 'Ваш WhatsApp'
    }
    return labels[method] ?? ''
  }, [])

  const getContactPlaceholder = useCallback((method: string): string => {
    const placeholders: Record<string, string> = {
      telegram: '@username или t.me/username',
      email: 'example@email.com',
      phone: '+7 (999) 123-45-67',
      whatsapp: '+7 (999) 123-45-67'
    }
    return placeholders[method] ?? '+7 (999) 123-45-67'
  }, [])

  const getContactType = useCallback((method: string): string => {
    if (method === 'email') return 'email'
    if (method === 'phone' || method === 'whatsapp') return 'tel'
    return 'text'
  }, [])

  const handleServiceChange = useCallback((value: string | null) => {
    onServiceChange(value || '')
    onDateChange('')
    onTimeChange('')
  }, [onServiceChange, onDateChange, onTimeChange])

  const selectedMethod = useMemo(
    () => availableContactMethods.find(m => m.type === selectedContactMethod),
    [availableContactMethods, selectedContactMethod]
  )
  const ContactIcon = selectedMethod?.icon ?? null

  const serviceOptions = useMemo(
    () => createServiceSelectOptions(services),
    [services]
  )

  const selectedService = useMemo(
    () => services.find(s => s.id === selectedServiceId),
    [services, selectedServiceId]
  )

  const formatSelectedDate = useCallback((dateStr: string): string => {
    if (!dateStr) return ''
    return dayjs(dateStr).format('D MMMM YYYY, dddd')
  }, [])

  const [currentMonth, setCurrentMonth] = useState(() => dayjs().startOf('month'))

  const calendarDates = useMemo(() => {
    const start = currentMonth.startOf('month').startOf('week')
    const end = currentMonth.endOf('month').endOf('week')
    const dates: dayjs.Dayjs[] = []
    let date = start
    while (date.isBefore(end) || date.isSame(end, 'day')) {
      dates.push(date)
      date = date.add(1, 'day')
    }
    return dates
  }, [currentMonth])

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const handleDateClick = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD')
    if (availableDates.includes(dateStr) && !date.isBefore(dayjs(), 'day')) {
      onDateChange(dateStr)
      onTimeChange('')
    }
  }

  const isDateAvailable = (date: dayjs.Dayjs): boolean => {
    const dateStr = date.format('YYYY-MM-DD')
    return availableDates.includes(dateStr)
  }

  const isDateSelected = (date: dayjs.Dayjs): boolean => {
    if (!selectedDate) return false
    return date.format('YYYY-MM-DD') === selectedDate
  }

  const isCurrentMonth = (date: dayjs.Dayjs): boolean => {
    return date.month() === currentMonth.month()
  }

  const isToday = (date: dayjs.Dayjs): boolean => {
    return date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  }

  const isPast = (date: dayjs.Dayjs): boolean => {
    return date.isBefore(dayjs(), 'day')
  }

  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  return (
    <form onSubmit={onSubmit} className={s.form}>
      <Card padding="md" radius="md" withBorder className={s.formCard}>
        <Stack gap="lg">
          {services.length > 0 && (
            <div className={s.serviceSelectWrapper}>
              <Group gap="xs" mb="xs">
                <IconBriefcase size={18} stroke={1.5} />
                <Text fw={500} size="sm">Выберите услугу</Text>
              </Group>
              <Select
                placeholder="Выберите услугу"
                value={selectedServiceId}
                onChange={handleServiceChange}
                data={serviceOptions}
                required
                size="md"
              />
              {selectedService?.description && (
                <Text size="xs" c="dimmed" mt="xs">
                  {selectedService.description}
                </Text>
              )}
            </div>
          )}

          {(selectedServiceId || services.length === 0) && (
            <div className={s.dateSection}>
              <Group gap="xs" mb="md">
                <IconCalendar size={18} stroke={1.5} />
                <Text fw={500} size="sm">Выберите дату</Text>
              </Group>

            {selectedDate && (
              <div className={s.selectedDateDisplay}>
                <Text size="sm" fw={500}>
                  {formatSelectedDate(selectedDate)}
                </Text>
                <Button
                  type="button"
                  variant="subtle"
                  size="xs"
                  onClick={() => {
                    onDateChange('')
                    onTimeChange('')
                  }}
                >
                  Изменить
                </Button>
              </div>
            )}

            <div className={s.customCalendar}>
              <div className={s.calendarHeader}>
                <ActionIcon variant="subtle" onClick={prevMonth} size="lg">
                  <IconChevronLeft size={18} />
                </ActionIcon>
                <Text fw={600} size="md">
                  {currentMonth.format('MMMM YYYY')}
                </Text>
                <ActionIcon variant="subtle" onClick={nextMonth} size="lg">
                  <IconChevronRight size={18} />
                </ActionIcon>
              </div>

              <div className={s.weekdaysRow}>
                {weekDays.map((day) => (
                  <div key={day} className={s.weekday}>
                    {day}
                  </div>
                ))}
              </div>

              <div className={s.calendarGrid}>
                {calendarDates.map((date) => {
                  const available = isDateAvailable(date)
                  const selected = isDateSelected(date)
                  const currentMonthDate = isCurrentMonth(date)
                  const today = isToday(date)
                  const past = isPast(date)

                  return (
                    <button
                      key={date.format('YYYY-MM-DD')}
                      type="button"
                      className={`${s.calendarDay} ${!currentMonthDate ? s.otherMonth : ''
                        } ${past || !available ? s.disabled : ''} ${selected ? s.selected : ''
                        } ${today ? s.today : ''}`}
                      onClick={() => handleDateClick(date)}
                      disabled={past || !available}
                    >
                      {date.format('D')}
                    </button>
                  )
                })}
              </div>
            </div>

            {availableDates.length > 0 && (
              <Text size="xs" c="dimmed" mt={8}>
                Доступно дат: {availableDates.length}
              </Text>
            )}
            </div>
          )}

          {(selectedServiceId || services.length === 0) && selectedDate && availableTimes.length > 0 && (
            <div className={s.timeSelectWrapper}>
              <Group gap="xs" mb="xs">
                <IconClock size={18} stroke={1.5} />
                <Text fw={500} size="sm">Выберите время</Text>
              </Group>
              <Select
                placeholder="Выберите время"
                value={selectedTime}
                onChange={value => onTimeChange(value || '')}
                data={availableTimesWithEnd}
                required
                size="md"
              />
            </div>
          )}

          {(selectedServiceId || services.length === 0) && selectedDate && availableTimes.length === 0 && (
            <Card padding="md" radius="md" bg="var(--bg-secondary)" withBorder className={s.noSlotsCard}>
              <Text size="sm" c="dimmed" ta="center">
                На выбранную дату нет свободного времени
              </Text>
            </Card>
          )}
        </Stack>
      </Card>

      {(selectedServiceId || services.length === 0) && selectedDate && selectedTime && availableContactMethods.length > 0 && (
        <Card padding="md" radius="md" withBorder className={`${s.formCard} ${s.contactCard}`}>
          <Stack gap="lg">
            <Divider label="Ваши контактные данные" labelPosition="center" />

            <div>
              <Group gap="xs" mb="xs">
                <IconUser size={18} stroke={1.5} />
                <Text fw={500} size="sm">Ваше имя</Text>
              </Group>
              <Input
                value={clientName}
                onChange={onNameChange}
                placeholder="Введите ваше имя"
                required
                size="md"
              />
            </div>

            <div>
              <Text fw={500} size="sm" mb="xs">Выберите способ связи</Text>
              <Radio.Group
                value={selectedContactMethod}
                onChange={value => {
                  onContactMethodChange(value)
                  onContactChange('')
                }}
              >
                <Stack gap="sm">
                  {availableContactMethods.map(method => {
                    const Icon = method.icon
                    return (
                      <Radio
                        key={method.type}
                        value={method.type}
                        label={
                          <Group gap="xs">
                            <Icon size={18} stroke={1.5} />
                            <Text size="sm">{method.label}</Text>
                          </Group>
                        }
                      />
                    )
                  })}
                </Stack>
              </Radio.Group>
            </div>

            {selectedContactMethod && (
              <div>
                <Group gap="xs" mb="xs">
                  {ContactIcon && <ContactIcon size={18} stroke={1.5} />}
                  <Text fw={500} size="sm">
                    {getContactLabel(selectedContactMethod)}
                  </Text>
                </Group>
                <Input
                  value={clientContact}
                  onChange={onContactChange}
                  onBlur={onContactBlur}
                  placeholder={getContactPlaceholder(selectedContactMethod)}
                  type={getContactType(selectedContactMethod)}
                  required
                  size="md"
                  error={contactError || undefined}
                  maxLength={selectedContactMethod === 'phone' || selectedContactMethod === 'whatsapp' ? 18 : undefined}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending || !selectedContactMethod || !clientContact.trim()}
              fullWidth
              size="md"
              leftSection={<IconCheck size={18} />}
            >
              {isPending ? 'Создание записи...' : 'Записаться'}
            </Button>
          </Stack>
        </Card>
      )}
    </form>
  )
}
