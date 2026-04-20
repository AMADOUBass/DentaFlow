import { 
  addMinutes, 
  format, 
  isBefore, 
  isAfter, 
  parse, 
  isWithinInterval, 
  areIntervalsOverlapping,
  startOfDay,
  setHours,
  setMinutes
} from 'date-fns'
import { prisma } from './prisma'
import { AppointmentStatus } from '@prisma/client'

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

  const targetDate = new Date(date + 'T00:00:00')
  const weekday = targetDate.getDay() // 0=Dim, 1=Lun ...

  // 2. Fetch all eligible practitioners if 'any'
  const practitioners = await prisma.practitioner.findMany({
    where: {
      tenantId,
      active: true,
      ...(practitionerId !== 'any' ? { id: practitionerId } : {}),
      services: {
        some: { serviceId }
      }
    },
    include: {
      schedules: {
        where: { weekday }
      }
    }
  })

  let allSlots: string[] = []

  // 3. For each practitioner, calculate their individual slots
  for (const practitioner of practitioners) {
    const schedule = practitioner.schedules[0]
    if (!schedule) continue

    // Get existing appointments for this practitioner on this day
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        practitionerId: practitioner.id,
        startsAt: {
          gte: startOfDay(targetDate),
          lt: addMinutes(startOfDay(targetDate), 1440)
        },
        status: {
          notIn: [AppointmentStatus.CANCELLED]
        }
      }
    })

    // Get time-offs
    const timeOffs = await prisma.timeOff.findMany({
      where: {
        practitionerId: practitioner.id,
        OR: [
          { startDate: { lte: targetDate }, endDate: { gte: targetDate } }
        ]
      }
    })

    // Calculate possible slots
    const dayStart = parse(schedule.startTime, 'HH:mm', targetDate)
    const dayEnd = parse(schedule.endTime, 'HH:mm', targetDate)
    
    let currentSlot = dayStart
    
    while (isBefore(currentSlot, dayEnd)) {
      const slotEnd = addMinutes(currentSlot, service.durationMin)
      
      if (isAfter(slotEnd, dayEnd)) break

      const slotInterval = { start: currentSlot, end: slotEnd }

      // Check lunch break
      let isLunch = false
      if (schedule.lunchStart && schedule.lunchEnd) {
        const lunchStart = parse(schedule.lunchStart, 'HH:mm', targetDate)
        const lunchEnd = parse(schedule.lunchEnd, 'HH:mm', targetDate)
        if (areIntervalsOverlapping(slotInterval, { start: lunchStart, end: lunchEnd })) {
          isLunch = true
        }
      }

      // Check existing appointments
      const hasConflict = existingAppointments.some(apt => 
        areIntervalsOverlapping(slotInterval, { start: apt.startsAt, end: apt.endsAt })
      )

      // Check time-offs
      const hasTimeOff = timeOffs.some(to => 
        areIntervalsOverlapping(slotInterval, { start: to.startDate, end: to.endDate })
      )

      if (!isLunch && !hasConflict && !hasTimeOff) {
        allSlots.push(format(currentSlot, 'HH:mm'))
      }

      currentSlot = addMinutes(currentSlot, 15) // Step of 15 mins for slot starts
    }
  }

  // 4. Sort and unique if multiple practitioners
  return Array.from(new Set(allSlots)).sort()
}
