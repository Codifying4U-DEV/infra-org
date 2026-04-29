import { ORGANIZATION_CATALOG } from "./catalog";

const FOLDER_CATALOG = ORGANIZATION_CATALOG.folders;
const PROJECT_CATALOG = ORGANIZATION_CATALOG.projects;
const ORGANIZATION_IAM_CATALOG = ORGANIZATION_CATALOG.iam.organization;
const PROJECT_IAM_CATALOG = ORGANIZATION_CATALOG.iam.projects;
const SERVICE_ACCOUNT_CATALOG = ORGANIZATION_CATALOG.serviceAccounts;

export function validateOrganizationCatalogs(): void {
  validateUniqueValues("folder keys", FOLDER_CATALOG.map((folder) => folder.key));
  validateUniqueValues("project keys", PROJECT_CATALOG.map((project) => project.key));
  validateUniqueValues("project ids", PROJECT_CATALOG.map((project) => project.id));
  validateUniqueValues("service account keys", SERVICE_ACCOUNT_CATALOG.map((account) => account.key));
  validateUniqueValues("service account ids", SERVICE_ACCOUNT_CATALOG.map((account) => account.accountId));
  validateUniqueValues("organization IAM resource names", ORGANIZATION_IAM_CATALOG.map((binding) => binding.resourceName));

  const folderKeys = new Set(FOLDER_CATALOG.map((folder) => folder.key));
  const projectKeys = new Set(PROJECT_CATALOG.map((project) => project.key));

  FOLDER_CATALOG.forEach((folder) => {
    if (folder.parent !== "organization" && !folderKeys.has(folder.parent)) {
      throw new Error(`Folder "${folder.key}" references missing parent folder "${folder.parent}".`);
    }
  });

  PROJECT_CATALOG.forEach((project) => {
    if (!folderKeys.has(project.folder)) {
      throw new Error(`Project "${project.key}" references missing folder "${project.folder}".`);
    }
  });

  PROJECT_IAM_CATALOG.forEach((binding) => {
    binding.projectKeys.forEach((projectKey) => {
      if (!projectKeys.has(projectKey)) {
        throw new Error(`Project IAM binding "${binding.suffix}" references missing project "${projectKey}".`);
      }
    });
  });

  SERVICE_ACCOUNT_CATALOG.forEach((account) => {
    if (!projectKeys.has(account.project)) {
      throw new Error(`Service account "${account.key}" references missing project "${account.project}".`);
    }

    account.roles.forEach((role) => {
      if (!projectKeys.has(role.project)) {
        throw new Error(`Service account "${account.key}" role "${role.role}" references missing project "${role.project}".`);
      }
    });
  });
}

function validateUniqueValues(name: string, values: readonly string[]): void {
  const seen = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) {
      throw new Error(`Duplicate ${name} value "${value}".`);
    }

    seen.add(value);
  });
}
