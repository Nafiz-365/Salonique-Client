import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const uri = process.env.MONGODB_URI as string
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "salonique-better-auth-secret-development-key-32chars");

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET must be set in production.");
}

declare global {
  var _authMongoClient: MongoClient | undefined;
}

let mongoClient: MongoClient;
if (process.env.NODE_ENV === "development") {
  if (!global._authMongoClient) {
    global._authMongoClient = new MongoClient(uri);
  }
  mongoClient = global._authMongoClient;
} else {
  mongoClient = new MongoClient(uri);
}

const database = mongoClient.db("salonique");

export const auth = betterAuth({
  database: mongodbAdapter(database, { client: mongoClient }),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
    }
    : {}),
  plugins: [
    jwt({
      // We will manually attach the JWT in the BFF proxy
      disableSettingJwtHeader: true,
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        defaultValue: "",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
