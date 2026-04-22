
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error("Please provide an email")
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: UserRole.SUPERADMIN }
  })

  console.log(`User ${email} promoted to SUPERADMIN`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
