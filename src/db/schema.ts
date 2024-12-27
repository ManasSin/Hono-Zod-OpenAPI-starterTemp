import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

const defaultNow = sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`;

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  done: integer("done", { mode: "boolean" }).notNull().default(false),

  //   createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(defaultNow),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(defaultNow)
    .$onUpdate(() => new Date()),

//   deleted: integer("deleted", { mode: "boolean" }).notNull().default(false),
//   deletedAt: integer("deleted_at", { mode: "timestamp" })
//     // @ts-expect-error : null is not allowed
//     .default(null)
//     // @ts-expect-error : any is not allowed
//     .$onUpdateFn(context => context.row.deleted === true ? new Date() : null),
});

export const insertTaskSchema = createInsertSchema(tasks, {
  name: z.string().min(2).max(500),
})
  .required({
    done: true,
  })
  .omit({ id: true, createdAt: true, updatedAt: true });
export const selectTaskSchema = createSelectSchema(tasks);
export const updateTaskSchema = createUpdateSchema(tasks);

// to know more please visit https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-zod/README.md
