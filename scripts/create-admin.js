const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    
    if (!email || !password) {
      console.log('Usage: node scripts/create-admin.js <email> <password>');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Update existing user to admin
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });
      console.log(`User ${email} has been promoted to admin.`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: email.split('@')[0],
          role: 'ADMIN'
        }
      });
      console.log(`Admin user ${email} has been created.`);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();