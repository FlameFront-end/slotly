import { useState, useEffect, useMemo, type ComponentType } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { IconBrandTelegram, IconMail, IconPhone, IconBrandWhatsapp, IconBrandInstagram, IconBrandVk, IconBrandFacebook, IconBrandYoutube, IconBrandTiktok, IconWorld } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useAvailableSlots } from '@/shared/api/services/schedule'
import { useCreateBooking } from '@/shared/api/services/bookings'
import { useOwnerProfileByPublicId } from '@/shared/api/services/owner'
import { usePublicServices } from '@/shared/api/services/services'
import { ROUTES } from '@/shared/model/routes'
import { getErrorMessage, validateTelegram, validateEmail, validatePhone, formatPhoneNumber, formatTelegramValue } from '@/shared/lib'

const SLOT_TAKEN_MESSAGE = 'Слот уже занят'

export const usePublicBooking = () => {
  const { ownerId } = useParams<{ ownerId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [clientName, setClientName] = useState('')
  const [selectedContactMethod, setSelectedContactMethod] = useState<string>('')
  const [clientContact, setClientContact] = useState('')
  const [contactError, setContactError] = useState('')
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const startDate = dayjs().format('YYYY-MM-DD')

  const { data: ownerProfile, isLoading: isLoadingProfile } = useOwnerProfileByPublicId(ownerId || '')
  const { data: services, isLoading: isLoadingServices } = usePublicServices(ownerId || '')
  const { data: slots, isLoading: isLoadingSlots } = useAvailableSlots(
    ownerId || '',
    startDate,
    undefined,
    selectedServiceId || undefined
  )
  const createBookingMutation = useCreateBooking()

  const isLoading = isLoadingProfile || isLoadingSlots || isLoadingServices

  const availableDates = useMemo(() => {
    return slots
      ? Array.from(new Set(slots.map(slot => slot.date))).sort()
      : []
  }, [slots])

  const availableTimesWithEnd = useMemo(() => {
    if (!slots || !selectedDate) return []

    const daySlots = slots.filter(slot => slot.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))

    return daySlots.map(slot => {
      const [hours, minutes] = slot.time.split(':').map(Number)
      const startTime = dayjs(selectedDate).hour(hours).minute(minutes)
      const slotDuration = slot.slotDuration || 60
      const endTime = startTime.add(slotDuration, 'minutes')
      return {
        value: slot.time,
        label: `${slot.time} - ${endTime.format('HH:mm')}`
      }
    })
  }, [slots, selectedDate])

  const availableTimes = useMemo(() => {
    return availableTimesWithEnd.map(item => item.value)
  }, [availableTimesWithEnd])

  const availableContactMethods = useMemo(() => {
    if (!ownerProfile?.contactMethods) return []

    const methods: Array<{ type: 'telegram' | 'email' | 'phone' | 'whatsapp', value: string, label: string, icon: ComponentType<{ size?: string | number; stroke?: string | number }> }> = []

    if (ownerProfile.contactMethods.telegram?.enabled) {
      methods.push({ type: 'telegram', value: '', label: 'Telegram', icon: IconBrandTelegram })
    }
    if (ownerProfile.contactMethods.email?.enabled) {
      methods.push({ type: 'email', value: '', label: 'Email', icon: IconMail })
    }
    if (ownerProfile.contactMethods.phone?.enabled) {
      methods.push({ type: 'phone', value: '', label: 'Телефон', icon: IconPhone })
    }
    if (ownerProfile.contactMethods.whatsapp?.enabled) {
      methods.push({ type: 'whatsapp', value: '', label: 'WhatsApp', icon: IconBrandWhatsapp })
    }

    return methods
  }, [ownerProfile])

  const enabledSocialLinks = useMemo(() => {
    if (!ownerProfile?.socialLinks) return []

    const socialLinks = ownerProfile.socialLinks
    const links: Array<{ type: string, value: string, icon: ComponentType<{ size?: string | number; stroke?: string | number }> }> = []

    if (socialLinks.instagram?.enabled && socialLinks.instagram.value) {
      links.push({ type: 'instagram', value: socialLinks.instagram.value, icon: IconBrandInstagram })
    }
    if (socialLinks.vk?.enabled && socialLinks.vk.value) {
      links.push({ type: 'vk', value: socialLinks.vk.value, icon: IconBrandVk })
    }
    if (socialLinks.facebook?.enabled && socialLinks.facebook.value) {
      links.push({ type: 'facebook', value: socialLinks.facebook.value, icon: IconBrandFacebook })
    }
    if (socialLinks.youtube?.enabled && socialLinks.youtube.value) {
      links.push({ type: 'youtube', value: socialLinks.youtube.value, icon: IconBrandYoutube })
    }
    if (socialLinks.tiktok?.enabled && socialLinks.tiktok.value) {
      links.push({ type: 'tiktok', value: socialLinks.tiktok.value, icon: IconBrandTiktok })
    }
    if (socialLinks.ok?.enabled && socialLinks.ok.value) {
      links.push({ type: 'ok', value: socialLinks.ok.value, icon: IconWorld })
    }

    return links
  }, [ownerProfile])

  useEffect(() => {
    if (availableContactMethods.length > 0 && !selectedContactMethod) {
      setSelectedContactMethod(availableContactMethods[0].type)
    }
  }, [availableContactMethods, selectedContactMethod])

  useEffect(() => {
    if (availableTimes.length > 0 && !selectedTime) {
      setSelectedTime(availableTimes[0])
    }
  }, [selectedDate, availableTimes, selectedTime])

  const handleContactBlur = (): void => {
    if (!clientContact.trim()) {
      setContactError('')
      return
    }

    let error = ''
    if (selectedContactMethod === 'telegram') {
      error = validateTelegram(clientContact)
    } else if (selectedContactMethod === 'email') {
      error = validateEmail(clientContact)
    } else if (selectedContactMethod === 'phone' || selectedContactMethod === 'whatsapp') {
      error = validatePhone(clientContact)
    }
    setContactError(error)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !clientName || !selectedContactMethod || !clientContact.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Заполните все поля',
        color: 'red'
      })
      return
    }

    let validationError = ''
    if (selectedContactMethod === 'telegram') {
      validationError = validateTelegram(clientContact)
    } else if (selectedContactMethod === 'email') {
      validationError = validateEmail(clientContact)
    } else if (selectedContactMethod === 'phone' || selectedContactMethod === 'whatsapp') {
      validationError = validatePhone(clientContact)
    }

    if (validationError) {
      setContactError(validationError)
      notifications.show({
        title: 'Ошибка валидации',
        message: validationError,
        color: 'red'
      })
      return
    }

    if (!ownerId) {
      notifications.show({
        title: 'Ошибка',
        message: 'Ошибка загрузки. Откройте страницу по ссылке из сообщения или письма.',
        color: 'red'
      })
      return
    }

    try {
      const booking = await createBookingMutation.mutateAsync({
        clientName,
        clientContact,
        date: selectedDate,
        time: selectedTime,
        ownerId,
        serviceId: selectedServiceId || undefined
      })

      notifications.show({
        title: 'Успешно',
        message: 'Запись создана. Сохраните ссылку — по ней вы всегда сможете посмотреть детали.',
        color: 'green'
      })
      navigate(ROUTES.PUBLIC_BOOKING_CONFIRMATION.replace(':bookingId', booking.id))
    } catch (error: unknown) {
      const message = getErrorMessage(error)
      if (message === SLOT_TAKEN_MESSAGE && ownerId) {
        setSelectedTime('')
        await queryClient.invalidateQueries({
          queryKey: ['schedule', 'slots', ownerId]
        })
      }
      notifications.show({
        title: 'Ошибка',
        message,
        color: 'red'
      })
    }
  }

  const handleContactChange = (value: string): void => {
    if (contactError) {
      setContactError('')
    }
    if (selectedContactMethod === 'phone' || selectedContactMethod === 'whatsapp') {
      const formatted = formatPhoneNumber(value)
      setClientContact(formatted)
    } else if (selectedContactMethod === 'telegram') {
      const formatted = formatTelegramValue(value)
      setClientContact(formatted)
    } else {
      setClientContact(value)
    }
  }

  return {
    ownerProfile,
    slots,
    services: services || [],
    isLoading,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedServiceId,
    setSelectedServiceId,
    clientName,
    setClientName,
    selectedContactMethod,
    setSelectedContactMethod,
    clientContact,
    setClientContact: handleContactChange,
    contactError,
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    availableDates,
    availableTimes,
    availableTimesWithEnd,
    availableContactMethods,
    enabledSocialLinks,
    handleContactBlur,
    handleSubmit,
    isPending: createBookingMutation.isPending
  }
}
