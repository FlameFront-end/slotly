import { type FC, useMemo, useState, type ComponentType } from 'react'
import { Card, Stack, Group, Text, Select, Radio, Divider, ActionIcon } from '@mantine/core'
import { IconCalendar, IconClock, IconUser, IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Button, Input } from '@/shared/kit'
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

interface Props {
  selectedDate: string
  selectedTime: string
  clientName: string
  selectedContactMethod: string
  clientContact: string
  contactError: string
  availableDates: string[]
  availableTimes: string[]
  availableTimesWithEnd: TimeOption[]
  availableContactMethods: ContactMethod[]
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
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
  clientName,
  selectedContactMethod,
  clientContact,
  contactError,
  availableDates,
  availableTimes,
  availableTimesWithEnd,
  availableContactMethods,
  onDateChange,
  onTimeChange,
  onNameChange,
  onContactMethodChange,
  onContactChange,
  onContactBlur,
  onSubmit,
  isPending
}) => {
  const getContactLabel = (method: string): string => {
    if (method === 'telegram') return 'Ваш Telegram'
    if (method === 'email') return 'Ваш Email'
    if (method === 'phone') return 'Ваш телефон'
    if (method === 'whatsapp') return 'Ваш WhatsApp'
    return ''
  }

  const getContactPlaceholder = (method: string): string => {
    if (method === 'telegram') return '@username или t.me/username'
    if (method === 'email') return 'example@email.com'
    return '+7 (999) 123-45-67'
  }

  const getContactType = (method: string): string => {
    if (method === 'email') return 'email'
    if (method === 'phone' || method === 'whatsapp') return 'tel'
    return 'text'
  }

  const selectedMethod = availableContactMethods.find(m => m.type === selectedContactMethod)
  const ContactIcon = selectedMethod ? selectedMethod.icon : null

  const formatSelectedDate = (dateStr: string): string => {
    if (!dateStr) return ''
    return dayjs(dateStr).format('D MMMM YYYY, dddd')
  }

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

          {selectedDate && availableTimes.length > 0 && (
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

          {selectedDate && availableTimes.length === 0 && (
            <Card padding="md" radius="md" bg="var(--bg-secondary)" withBorder className={s.noSlotsCard}>
              <Text size="sm" c="dimmed" ta="center">
                На выбранную дату нет свободного времени
              </Text>
            </Card>
          )}
        </Stack>
      </Card>

      {selectedDate && selectedTime && availableContactMethods.length > 0 && (
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
