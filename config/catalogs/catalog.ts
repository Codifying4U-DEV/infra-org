import { z } from "zod";
import rawCatalog from "./infrastructure.json";

const labelsSchema = z.object({
  env: z.string(),
  product: z.string(),
  owner: z.string(),
});

const serviceAccountRoleSchema = z.object({
  project: z.string(),
  role: z.string().startsWith("roles/"),
});

const organizationCatalogSchema = z.object({
  groups: z.record(z.string(), z.string()),
  folders: z.array(z.object({
    key: z.string(),
    resourceName: z.string(),
    displayName: z.string(),
    parent: z.string(),
  })),
  projects: z.array(z.object({
    key: z.string(),
    resourceName: z.string(),
    id: z.string(),
    folder: z.string(),
    labels: labelsSchema,
  })),
  iam: z.object({
    organization: z.array(z.object({
      group: z.string(),
      role: z.string().startsWith("roles/"),
      resourceName: z.string(),
    })),
    projects: z.array(z.object({
      group: z.string(),
      role: z.string().startsWith("roles/"),
      projectKeys: z.array(z.string()),
      suffix: z.string(),
    })),
  }),
  serviceAccounts: z.array(z.object({
    key: z.string(),
    accountId: z.string(),
    displayName: z.string(),
    project: z.string(),
    roles: z.array(serviceAccountRoleSchema).default([]),
  })),
});

export const ORGANIZATION_CATALOG = organizationCatalogSchema.parse(rawCatalog);
