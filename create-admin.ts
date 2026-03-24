import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'adminpassword';
  const email = 'admin@marketverse.com';
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const existingAdmin = await prisma.user.findUnique({ where: { username } });
  if (existingAdmin) {
    await prisma.user.update({
        where: { username },
        data: { role: 'ADMIN', passwordHash }
    });
    console.log('Updated existing admin user account');
  } else {
    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: 'ADMIN',
        accountStatus: 'ACTIVE',
        firstName: 'System',
        lastName: 'Admin'
      }
    });
    console.log('Created new admin user account');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
