import { config } from "dotenv";

config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL_UNPOOLED ou DATABASE_URL é obrigatório para migrações"
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url,
  },
});