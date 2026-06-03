import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SYSTEM_CATEGORIES = [
  { name: "Food & Dining", color: "#f59e0b", icon: "utensils" },
  { name: "Travel", color: "#3b82f6", icon: "plane" },
  { name: "Office Supplies", color: "#6366f1", icon: "briefcase" },
  { name: "Software & Tools", color: "#8b5cf6", icon: "laptop" },
  { name: "Marketing", color: "#ec4899", icon: "megaphone" },
  { name: "Healthcare", color: "#10b981", icon: "heart" },
  { name: "Utilities", color: "#14b8a6", icon: "zap" },
  { name: "Entertainment", color: "#f97316", icon: "star" },
  { name: "Rent", color: "#ef4444", icon: "home" },
  { name: "Other", color: "#9ca3af", icon: "tag" },
];

async function main() {
  console.log("Seeding system categories...");

  for (const cat of SYSTEM_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_organizationId: { name: cat.name, organizationId: "" } },
      update: {},
      create: { ...cat, isSystem: true, organizationId: null },
    });
  }

  console.log(`Seeded ${SYSTEM_CATEGORIES.length} system categories.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
