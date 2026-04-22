import { 
  addMinutes, 
  format, 
  isBefore, 
  isAfter, 
  parse, 
  areIntervalsOverlapping,
  startOfDay,
} from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { prisma } from './prisma'
import { AppointmentStatus } from '@prisma/client'

const TIMEZONE = 'America/Toronto'

/**
 * Calculates available time slots for a specific date, service and practitioner
 */
export async function getAvailableSlots({
  tenantId,
  practitionerId,
  serviceId,
  date // "YYYY-MM-DD"
}: {
  tenantId: string
  practitionerId: string | 'any'
  serviceId: string
  date: string
}) {
  // 1. Fetch dependencies
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })
  if (!service) throw new Error("Service non trouvé")

  // Ensure we work in America/Toronto
  const targetDate = fromZonedTime(`${date}T00:00:00`, TIMEZONE)
  const nowInToronto = toZonedTime(new Date(), TIMEZONE)
  const weekday = targetDate.getDay()

  // 2. Fetch all eligible practitioners
  const practitioners = await prisma.practitioner.findMany({
    where: {
      tenantId,
      active: true,
      ...(practitionerId !== 'any' ? { id: practitionerId } : {}),
      services: { some: { serviceId } }
    },
    include: {
      schedules: { where: { weekday } }
    }
  })

  let allSlots: string[] = []

  for (const practitioner of practitioners) {
    const schedule = practitioner.schedules[0]
    if (!schedule) continue

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        practitionerId: practitioner.id,
        startsAt: {
          gte: startOfDay(targetDate),
          lt: addMinutes(startOfDay(targetDate), 1440)
        },
        status: { notIn: [AppointmentStatus.CANCELLED] }
      }
    })

    const timeOffs = await prisma.timeOff.findMany({
      where: {
        practitionerId: practitioner.id,
        OR: [
          { startDate: { lte: targetDate }, endDate: { gte: targetDate } }
        ]
      }
    })

    const dayStart = fromZonedTime(`${date}T${schedule.startTime}:00`, TIMEZONE)
    const dayEnd = fromZonedTime(`${date}T${schedule.endTime}:00`, TIMEZONE)
    
    let currentSlot = dayStart
    
    while (isBefore(currentSlot, dayEnd)) {
      const slotEnd = addMinutes(currentSlot, service.durationMin)
      
      if (isAfter(slotEnd, dayEnd)) break

      const slotInterval = { start: currentSlot, end: slotEnd }

      // --- CHECKS ---
      
      // 1. Check if slot is in the past
      const isPast = isBefore(currentSlot, nowInToronto)

      // 2. Check lunch break
      let isLunch = false
      if (schedule.lunchStart && schedule.lunchEnd) {
        const lunchStart = fromZonedTime(`${date}T${schedule.lunchStart}:00`, TIMEZONE)
        const lunchEnd = fromZonedTime(`${date}T${schedule.lunchEnd}:00`, TIMEZONE)
        if (areIntervalsOverlapping(slotInterval, { start: lunchStart, end: lunchEnd })) {
          isLunch = true
        }
      }

      // 3. Check existing appointments
      const hasConflict = existingAppointments.some(apt => 
        areIntervalsOverlapping(slotInterval, { start: apt.startsAt, end: apt.endsAt })
      )

      // 4. Check time-offs
      const hasTimeOff = timeOffs.some(to => 
        areIntervalsOverlapping(slotInterval, { start: to.startDate, end: to.endDate })
      )

      if (!isPast && !isLunch && !hasConflict && !hasTimeOff) {
        allSlots.push(format(currentSlot, 'HH:mm'))
      }

      currentSlot = addMinutes(currentSlot, 15)
    }
  }

  return Array.from(new Set(allSlots)).sort()
}
