import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "Administrator" },
    update: {},
    create: {
      name: "Administrator",
      description: "Full system access and administrative privileges",
      permissions: {
        users: ["create", "read", "update", "delete"],
        audits: ["create", "read", "update", "delete"],
        reports: ["create", "read", "update", "delete"],
        admin: ["full"],
      },
    },
  });

  const auditorRole = await prisma.role.upsert({
    where: { name: "Lead Auditor" },
    update: {},
    create: {
      name: "Lead Auditor",
      description: "Can lead audit engagements and manage audit teams",
      permissions: {
        audits: ["create", "read", "update"],
        findings: ["create", "read", "update"],
        reports: ["create", "read"],
      },
    },
  });

  const auditeeRole = await prisma.role.upsert({
    where: { name: "Auditee" },
    update: {},
    create: {
      name: "Auditee",
      description: "Subject of audit engagements, can respond to findings",
      permissions: {
        audits: ["read"],
        findings: ["read", "respond"],
        actions: ["create", "update"],
      },
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "Department Manager" },
    update: {},
    create: {
      name: "Department Manager",
      description: "Manages department operations and audit responses",
      permissions: {
        audits: ["read"],
        findings: ["read"],
        actions: ["approve", "review"],
      },
    },
  });

  // Create departments
  const itDepartment = await prisma.department.upsert({
    where: { name: "Information Technology" },
    update: {},
    create: {
      name: "Information Technology",
      description: "Manages IT infrastructure, systems, and cybersecurity",
    },
  });

  const financeDepartment = await prisma.department.upsert({
    where: { name: "Finance" },
    update: {},
    create: {
      name: "Finance",
      description: "Handles financial operations, accounting, and reporting",
    },
  });

  const auditDepartment = await prisma.department.upsert({
    where: { name: "Internal Audit" },
    update: {},
    create: {
      name: "Internal Audit",
      description: "Conducts internal audits and risk assessments",
    },
  });

  const hrDepartment = await prisma.department.upsert({
    where: { name: "Human Resources" },
    update: {},
    create: {
      name: "Human Resources",
      description: "Manages employee relations, recruitment, and compliance",
    },
  });

  // Create users
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@audit.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@audit.com",
      password: hashedPassword,
      roleId: adminRole.id,
      departmentId: itDepartment.id,
    },
  });

  // Create auditor user
  const auditorPassword = await bcrypt.hash("auditor123", 10);

  const auditor = await prisma.user.upsert({
    where: { email: "auditor@audit.com" },
    update: {},
    create: {
      name: "John Auditor",
      email: "auditor@audit.com",
      password: auditorPassword,
      roleId: auditorRole.id,
      departmentId: auditDepartment.id,
    },
  });

  // Create auditee user
  const auditeePassword = await bcrypt.hash("auditee123", 10);

  const auditee = await prisma.user.upsert({
    where: { email: "auditee@audit.com" },
    update: {},
    create: {
      name: "Jane Auditee",
      email: "auditee@audit.com",
      password: auditeePassword,
      roleId: auditeeRole.id,
      departmentId: financeDepartment.id,
    },
  });

  // Update department managers
  await prisma.department.update({
    where: { id: itDepartment.id },
    data: { managerId: admin.id },
  });

  await prisma.department.update({
    where: { id: auditDepartment.id },
    data: { managerId: auditor.id },
  });

  // Create audit standards
  const iso27001 = await prisma.auditStandard.create({
    data: {
      name: "ISO 27001:2013",
      description: "Information Security Management System standard",
      version: "2013",
      effectiveDate: new Date("2013-10-01"),
      isActive: true,
    },
  });

  const sox = await prisma.auditStandard.create({
    data: {
      name: "SOX 404",
      description: "Sarbanes-Oxley Act Section 404 - Internal Controls",
      version: "2002",
      effectiveDate: new Date("2002-07-30"),
      isActive: true,
    },
  });

  // Create audit areas
  const itAuditArea = await prisma.auditArea.create({
    data: {
      name: "IT General Controls",
      description:
        "Controls over IT infrastructure, access management, and change management",
      riskLevel: "High",
      departmentId: itDepartment.id,
    },
  });

  const financialAuditArea = await prisma.auditArea.create({
    data: {
      name: "Financial Reporting",
      description:
        "Controls over financial statement preparation and reporting",
      riskLevel: "High",
      departmentId: financeDepartment.id,
    },
  });

  console.log("Seeding completed!");
  console.log("Created roles:", {
    adminRole: adminRole.name,
    auditorRole: auditorRole.name,
    auditeeRole: auditeeRole.name,
  });
  console.log("Created departments:", {
    it: itDepartment.name,
    finance: financeDepartment.name,
    audit: auditDepartment.name,
    hr: hrDepartment.name,
  });
  console.log("Created users:", {
    admin: admin.name,
    auditor: auditor.name,
    auditee: auditee.name,
  });
  console.log("Created audit standards:", {
    iso27001: iso27001.name,
    sox: sox.name,
  });
  console.log("Created audit areas:", {
    itAuditArea: itAuditArea.name,
    financialAuditArea: financialAuditArea.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
