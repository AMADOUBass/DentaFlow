
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.update({
    where: { email: 'proprio@demo.ca' },
    data: { role: UserRole.CLINIC_OWNER }
  })
  console.log("proprio@demo.ca reverted to CLINIC_OWNER")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
