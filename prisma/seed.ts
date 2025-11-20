import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("123456789", 10);

  // Create users
  await prisma.user.create({
    data: {
      firstname: "Bunthoeun",
      lastname: "KONG",
      password: hashedPassword,
      email: "jkfolk91@live.fr",
      role: "Admin",
    },
  });

  await prisma.user.create({
    data: {
      firstname: "Bella",
      lastname: "KIM",
      password: hashedPassword,
      email: "bella@live.fr",
      role: "User",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
