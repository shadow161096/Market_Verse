import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Delete all users except testuser
  await prisma.user.deleteMany({
    where: {
      username: { not: 'testuser' }
    }
  });

  console.log('Seeding initial categories...');
  const categoryNames = ['Cybernetics', 'Neural Implants', 'Vehicles', 'Weapons', 'Apparel'];
  const categories = await Promise.all(
    categoryNames.map(async (name) => {
      return prisma.category.create({
        data: {
          name,
          description: faker.commerce.productDescription(),
          imageUrl: faker.image.urlLoremFlickr({ category: 'technology' })
        }
      });
    })
  );

  console.log('Seeding products...');
  const products = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const category = faker.helpers.arrayElement(categories);
      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price({ min: 10, max: 20000, dec: 2 }),
          stock: faker.number.int({ min: 0, max: 1000 }),
          imageUrl: faker.image.urlLoremFlickr({ category: 'technology' }),
          categoryId: category.id
        }
      });
    })
  );

  console.log('Seeding users...');
  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash('password123', salt);

  const users = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      return prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          passwordHash: commonPassword,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: 'USER',
          accountStatus: 'ACTIVE',
        }
      });
    })
  );

  console.log('Seeding orders, reviews, and activity...');
  for (const user of users) {
    // Each user might make 0-3 orders
    const numOrders = faker.number.int({ min: 0, max: 3 });
    for (let i = 0; i < numOrders; i++) {
        // Create an order
        const numItems = faker.number.int({ min: 1, max: 5 });
        let total = 0;
        
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: 0, // Will update
                status: faker.helpers.arrayElement(['PENDING', 'SHIPPED', 'DELIVERED']),
                shippingAddress: faker.location.streetAddress()
            }
        });

        for (let j = 0; j < numItems; j++) {
            const product = faker.helpers.arrayElement(products);
            const quantity = faker.number.int({ min: 1, max: 3 });
            const itemTotal = Number(product.price) * quantity;
            total += itemTotal;

            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: product.id,
                    quantity,
                    price: product.price
                }
            });
            
            // Random chance to leave a review
            if (faker.datatype.boolean()) {
                await prisma.review.create({
                    data: {
                        userId: user.id,
                        productId: product.id,
                        rating: faker.number.int({ min: 3, max: 5 }), // Mostly positive
                        comment: faker.lorem.sentence()
                    }
                });
            }
        }

        await prisma.order.update({
            where: { id: order.id },
            data: { totalAmount: total }
        });
    }
  }

  // Ensure testuser exists
  const username = 'testuser';
  const email = 'test@marketverse.com';
  const password = 'password123';
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (!existingUser) {
    const password_hash = await bcrypt.hash(password, salt);
    await prisma.user.create({
        data: {
            username,
            email,
            passwordHash: password_hash, // matching schema spelling
            role: 'USER',
            accountStatus: 'ACTIVE',
        },
    });
  }

  console.log('✅ Successfully seeded database with realistic mock data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
