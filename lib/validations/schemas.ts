import { z } from "zod";

// User schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "agent", "frontline"]),
});

// Agent schemas
export const agentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  branch: z.string().min(2, "Branch must be at least 2 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Employee schemas
export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  branch: z.string().min(2, "Branch must be at least 2 characters"),
});

// Question schemas
export const questionSchema = z.object({
  question_text: z.string().min(5, "Question must be at least 5 characters"),
  question_type: z.enum(["agent", "employee"]),
  is_active: z.boolean().default(true),
  order_index: z.number().default(0),
});

// Rating schemas
export const ratingSchema = z.object({
  rater_name: z.string().min(2, "Name must be at least 2 characters"),
  rater_email: z.string().email("Invalid email address"),
  rater_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  policy_number: z.string().optional(),
  ratings: z
    .array(
      z.object({
        question_id: z.number(),
        rating_value: z.number().min(1).max(5),
        comments: z.string().optional(),
      }),
    )
    .min(1, "At least one rating is required"),
});

// Complaint schemas
export const complaintSchema = z.object({
  complainant_name: z.string().min(2, "Name must be at least 2 characters"),
  complainant_email: z.string().email("Invalid email address"),
  complainant_phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  policy_number: z.string().optional(),
  complaint_type: z.enum(["service", "billing", "claim", "policy", "other"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AgentFormData = z.infer<typeof agentSchema>;
export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
export type ComplaintFormData = z.infer<typeof complaintSchema>;
