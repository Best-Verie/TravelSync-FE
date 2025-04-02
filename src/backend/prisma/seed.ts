
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@gmail.com' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin@555', 10);
    
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
      },
    });
    
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
