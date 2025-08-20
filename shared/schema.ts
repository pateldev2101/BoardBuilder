import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#635BFF"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const boards = pgTable("boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").references(() => workspaces.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: varchar("board_id").references(() => boards.id).notNull(),
  name: text("name").notNull(),
  color: text("color").default("#635BFF"),
  position: text("position").notNull(),
  collapsed: text("collapsed").default("false"),
});

export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => groups.id).notNull(),
  name: text("name").notNull(),
  creativeBrief: text("creative_brief"),
  status: text("status").notNull().default("working"),
  priority: text("priority").notNull().default("medium"),
  type: text("type"),
  dueDate: timestamp("due_date"),
  ownerId: text("owner_id"),
  assigneeId: text("assignee_id"),
  prediction: text("prediction"),
  position: text("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  initials: text("initials").notNull(),
  color: text("color").default("#635BFF"),
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true });
export const insertBoardSchema = createInsertSchema(boards).omit({ id: true, createdAt: true });
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true });
export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type Workspace = typeof workspaces.$inferSelect;
export type Board = typeof boards.$inferSelect;
export type Group = typeof groups.$inferSelect;
export type Request = typeof requests.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type InsertBoard = z.infer<typeof insertBoardSchema>;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
