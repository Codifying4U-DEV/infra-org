# infra-org

Pulumi TypeScript project for the codifying4u.com GCP organization baseline.

## Scope

Creates:

- Organization folders
- Shared core projects
- Sandbox project
- IAM bindings using Google Groups only
- Bootstrap service accounts in `core-cicd`

Service account role assignments can be declared in the catalog for future use,
but this stack does not create those IAM bindings yet.

Does not create:

- DNS resources
- Squarespace resources
- Terraform resources
- `eplanner-dev`
- `eplanner-prd`
- CI/CD pipelines

## Structure

```text
config/catalogs/   JSON infrastructure catalog, Zod schema, and catalog validation
lib/               Pulumi config
modules/           Pulumi resource factories and organization component
types/             TypeScript domain contracts
index.ts           Pulumi entrypoint
```

## Validation

```bash
npm install
npm run typecheck
node -r ./register-aliases.js -r ts-node/register -e "const { validateOrganizationCatalogs } = require('@/config/catalogs'); validateOrganizationCatalogs();"
```

## Pulumi

Initialize the stack:

```bash
export PULUMI_CONFIG_PASSPHRASE="<PASSPHRASE>"
pulumi stack init org --secrets-provider=passphrase --non-interactive
```

Set required config:

```bash
pulumi config set orgId <ORG_ID> --stack org --non-interactive
pulumi config set billingAccount <BILLING_ACCOUNT_ID> --stack org --non-interactive
pulumi config set gcp:project core-state --stack org --non-interactive
```

Preview only:

```bash
npm run preview -- --stack org
```

Do not run:

```bash
pulumi up
```

## Catalog

The declarative infrastructure source is:

```text
config/catalogs/infrastructure.json
```

It is parsed and validated by:

```text
config/catalogs/catalog.ts
config/catalogs/validator.ts
```
