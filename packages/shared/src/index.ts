import { z } from "zod";

// Role schemas
export const RoleSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.any().optional(),
  createdAt: z.date(),
});

export const CreateRoleSchema = RoleSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateRoleSchema = CreateRoleSchema.partial();

// Department schemas
export const DepartmentSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  managerId: z.number().optional(),
  createdAt: z.date(),
});

export const CreateDepartmentSchema = DepartmentSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

// User schemas
export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  password: z.string(),
  email: z.string().email(),
  isActive: z.boolean().default(true),
  lastLogin: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roleId: z.number().optional(),
  departmentId: z.number().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
}).extend({
  password: z.string().min(8),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({
  password: true,
});

// Audit Standard schemas
export const AuditStandardSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().optional(),
  effectiveDate: z.date().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
});

export const CreateAuditStandardSchema = AuditStandardSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateAuditStandardSchema = CreateAuditStandardSchema.partial();

// Audit Area schemas
export const AuditAreaSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  riskLevel: z.string().optional(),
  departmentId: z.number(),
  createdAt: z.date(),
});

export const CreateAuditAreaSchema = AuditAreaSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateAuditAreaSchema = CreateAuditAreaSchema.partial();

// Audit Plan schemas
export const AuditPlanSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  fiscalYear: z.string(),
  description: z.string().optional(),
  status: z.string().default("Draft"),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.number(),
  approvedById: z.number().optional(),
  approvedAt: z.date().optional(),
});

export const CreateAuditPlanSchema = AuditPlanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvedById: true,
  approvedAt: true,
});

export const UpdateAuditPlanSchema = CreateAuditPlanSchema.partial();

// Audit Plan Item schemas
export const AuditPlanItemSchema = z.object({
  id: z.number(),
  planId: z.number(),
  areaId: z.number(),
  standardId: z.number().optional(),
  plannedStartDate: z.date().optional(),
  plannedEndDate: z.date().optional(),
  auditFrequency: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().default("Planned"),
  assignedAuditorId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAuditPlanItemSchema = AuditPlanItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAuditPlanItemSchema = CreateAuditPlanItemSchema.partial();

// Audit schemas
export const AuditSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  planItemId: z.number().optional(),
  areaId: z.number(),
  standardId: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.string().default("Not Started"),
  createdAt: z.date(),
  updatedAt: z.date(),
  leadAuditorId: z.number(),
});

export const CreateAuditSchema = AuditSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAuditSchema = CreateAuditSchema.partial();

// Audit Team schemas
export const AuditTeamSchema = z.object({
  id: z.number(),
  auditId: z.number(),
  userId: z.number(),
  role: z.string(),
  assignedAt: z.date(),
});

export const CreateAuditTeamSchema = AuditTeamSchema.omit({
  id: true,
  assignedAt: true,
});

export const UpdateAuditTeamSchema = CreateAuditTeamSchema.partial();

// Audit Checklist schemas
export const AuditChecklistSchema = z.object({
  id: z.number(),
  auditId: z.number().optional(),
  itemNumber: z.string().optional(),
  description: z.string().min(1),
  referenceStandard: z.string().optional(),
  createdAt: z.date(),
  createdById: z.number(),
});

export const CreateAuditChecklistSchema = AuditChecklistSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateAuditChecklistSchema = CreateAuditChecklistSchema.partial();

// Finding schemas
export const FindingSchema = z.object({
  id: z.number(),
  auditId: z.number(),
  checklistId: z.number().optional(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().optional(),
  severity: z.string().optional(),
  riskLevel: z.string().optional(),
  status: z.string().default("Open"),
  identifiedById: z.number(),
  identifiedDate: z.date(),
  dueDate: z.date().optional(),
  responsiblePartyId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateFindingSchema = FindingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  identifiedDate: true,
});

export const UpdateFindingSchema = CreateFindingSchema.partial();

// Corrective Action schemas
export const CorrectiveActionSchema = z.object({
  id: z.number(),
  findingId: z.number(),
  description: z.string().min(1),
  dueDate: z.date().optional(),
  status: z.string().default("Pending"),
  assignedToId: z.number(),
  completionDate: z.date().optional(),
  verificationRequired: z.boolean().default(true),
  verifiedById: z.number().optional(),
  verifiedDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCorrectiveActionSchema = CorrectiveActionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completionDate: true,
  verifiedById: true,
  verifiedDate: true,
});

export const UpdateCorrectiveActionSchema =
  CreateCorrectiveActionSchema.partial();

// Action Update schemas
export const ActionUpdateSchema = z.object({
  id: z.number(),
  actionId: z.number(),
  text: z.string().min(1),
  updateDate: z.date(),
  updatedById: z.number(),
  percentageComplete: z.number().min(0).max(100).default(0),
});

export const CreateActionUpdateSchema = ActionUpdateSchema.omit({
  id: true,
  updateDate: true,
});

export const UpdateActionUpdateSchema = CreateActionUpdateSchema.partial();

// Document schemas
export const DocumentSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.string().optional(),
  path: z.string(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
  relatedTo: z.string().optional(),
  relatedId: z.number().optional(),
  description: z.string().optional(),
  uploadedById: z.number(),
  uploadedAt: z.date(),
  findingId: z.number().optional(),
  correctiveActionId: z.number().optional(),
});

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,
  uploadedAt: true,
});

export const UpdateDocumentSchema = CreateDocumentSchema.partial();

// Comment schemas
export const CommentSchema = z.object({
  id: z.number(),
  content: z.string().min(1),
  relatedTo: z.string(),
  relatedId: z.number(),
  userId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  findingId: z.number().optional(),
});

export const CreateCommentSchema = CommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCommentSchema = CreateCommentSchema.partial();

// Audit Report schemas
export const AuditReportSchema = z.object({
  id: z.number(),
  auditId: z.number(),
  name: z.string().min(1),
  type: z.string().optional(),
  generationDate: z.date(),
  generatedById: z.number(),
  path: z.string().optional(),
  status: z.string().default("Draft"),
  approvedById: z.number().optional(),
  approvedAt: z.date().optional(),
});

export const CreateAuditReportSchema = AuditReportSchema.omit({
  id: true,
  generationDate: true,
  approvedById: true,
  approvedAt: true,
});

export const UpdateAuditReportSchema = CreateAuditReportSchema.partial();

// Notification schemas
export const NotificationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string().min(1),
  message: z.string().min(1),
  relatedTo: z.string().optional(),
  relatedId: z.number().optional(),
  isRead: z.boolean().default(false),
  createdAt: z.date(),
});

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
});

export const UpdateNotificationSchema = CreateNotificationSchema.partial();

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  roleId: z.number().optional(),
  departmentId: z.number().optional(),
});

// Types
export type Role = z.infer<typeof RoleSchema>;
export type CreateRole = z.infer<typeof CreateRoleSchema>;
export type UpdateRole = z.infer<typeof UpdateRoleSchema>;

export type Department = z.infer<typeof DepartmentSchema>;
export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartment = z.infer<typeof UpdateDepartmentSchema>;

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type AuditStandard = z.infer<typeof AuditStandardSchema>;
export type CreateAuditStandard = z.infer<typeof CreateAuditStandardSchema>;
export type UpdateAuditStandard = z.infer<typeof UpdateAuditStandardSchema>;

export type AuditArea = z.infer<typeof AuditAreaSchema>;
export type CreateAuditArea = z.infer<typeof CreateAuditAreaSchema>;
export type UpdateAuditArea = z.infer<typeof UpdateAuditAreaSchema>;

export type AuditPlan = z.infer<typeof AuditPlanSchema>;
export type CreateAuditPlan = z.infer<typeof CreateAuditPlanSchema>;
export type UpdateAuditPlan = z.infer<typeof UpdateAuditPlanSchema>;

export type AuditPlanItem = z.infer<typeof AuditPlanItemSchema>;
export type CreateAuditPlanItem = z.infer<typeof CreateAuditPlanItemSchema>;
export type UpdateAuditPlanItem = z.infer<typeof UpdateAuditPlanItemSchema>;

export type Audit = z.infer<typeof AuditSchema>;
export type CreateAudit = z.infer<typeof CreateAuditSchema>;
export type UpdateAudit = z.infer<typeof UpdateAuditSchema>;

export type AuditTeam = z.infer<typeof AuditTeamSchema>;
export type CreateAuditTeam = z.infer<typeof CreateAuditTeamSchema>;
export type UpdateAuditTeam = z.infer<typeof UpdateAuditTeamSchema>;

export type AuditChecklist = z.infer<typeof AuditChecklistSchema>;
export type CreateAuditChecklist = z.infer<typeof CreateAuditChecklistSchema>;
export type UpdateAuditChecklist = z.infer<typeof UpdateAuditChecklistSchema>;

export type Finding = z.infer<typeof FindingSchema>;
export type CreateFinding = z.infer<typeof CreateFindingSchema>;
export type UpdateFinding = z.infer<typeof UpdateFindingSchema>;

export type CorrectiveAction = z.infer<typeof CorrectiveActionSchema>;
export type CreateCorrectiveAction = z.infer<
  typeof CreateCorrectiveActionSchema
>;
export type UpdateCorrectiveAction = z.infer<
  typeof UpdateCorrectiveActionSchema
>;

export type ActionUpdate = z.infer<typeof ActionUpdateSchema>;
export type CreateActionUpdate = z.infer<typeof CreateActionUpdateSchema>;
export type UpdateActionUpdate = z.infer<typeof UpdateActionUpdateSchema>;

export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;

export type Comment = z.infer<typeof CommentSchema>;
export type CreateComment = z.infer<typeof CreateCommentSchema>;
export type UpdateComment = z.infer<typeof UpdateCommentSchema>;

export type AuditReport = z.infer<typeof AuditReportSchema>;
export type CreateAuditReport = z.infer<typeof CreateAuditReportSchema>;
export type UpdateAuditReport = z.infer<typeof UpdateAuditReportSchema>;

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotification = z.infer<typeof UpdateNotificationSchema>;

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Constants
export const AUDIT_TYPES = [
  "Financial",
  "Operational",
  "Compliance",
  "IT",
  "Risk",
] as const;

export const AUDIT_STATUSES = [
  "Not Started",
  "Planning",
  "Fieldwork",
  "Reporting",
  "Completed",
  "Cancelled",
] as const;

export const AUDIT_PLAN_STATUSES = [
  "Draft",
  "Approved",
  "Active",
  "Completed",
] as const;

export const FINDING_STATUSES = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
] as const;

export const RISK_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

export const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

export const SEVERITY_LEVELS = [
  "Minor",
  "Moderate",
  "Major",
  "Critical",
] as const;

export const CORRECTIVE_ACTION_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
  "Overdue",
  "Verified",
] as const;

export const DOCUMENT_TYPES = [
  "Evidence",
  "Report",
  "Policy",
  "Procedure",
  "Other",
] as const;

export type FileType = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  url: string;
  size: number;
};
