# Adding New Components to TSW

## Decision tree

Before writing a new component, ask:

1. **Does this already exist in `@ds-foundation/react`?**
   → Import and use it directly. No new file needed.

2. **Is this a generic primitive with no TSW-specific domain logic?**
   → Add to `atoms/`. Mark with `// @ds-candidate`.
   → Open a contribution PR to `ds-foundation-rt` (see below).

3. **Is this composed from atoms + TSW domain logic (e.g. a payment-specific widget)?**
   → Add to `molecules/`. Mark with `// @ds-molecule`.

4. **Is this a full feature section (table, modal, panel)?**
   → Add to `organisms/`. Mark with `// @tsw-organism`.

5. **Is this a page layout or prototype-specific view?**
   → Add to `templates/`. Mark with `// @tsw-template`.

## DS contract annotation reference

| Annotation | Meaning |
|------------|---------|
| `// @ds-candidate` | Generic, no TSW domain logic — contribute to DS Foundation |
| `// @tsw-atom` | TSW-specific primitive — stays local |
| `// @ds-molecule` | Composed from DS atoms + TSW domain logic |
| `// @tsw-organism` | TSW-specific feature section — stays local |
| `// @tsw-template` | Prototype page layout — stays local |

## Contributing to DS Foundation

1. Create a branch in `ds-foundation-rt`
2. Add the component file to `packages/react/src/`
3. Add a MDX registry spec to `packages/registry/`
4. Add a Storybook story to `packages/storybook/`
5. Run `npm run validate` — must pass typecheck + registry build
6. Run `npx changeset` to add a changelog entry
7. Open a PR

## Candidates for Phase 3 contribution

- `atoms/IconButton.tsx` — generic, no domain logic
- `atoms/DetailCard.tsx` — generic info card pattern
- `atoms/Badge.tsx` — generic badge, TSW-specific state map only
