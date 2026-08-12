# Skill mechanics

## Invocation

Choose model invocation only when the agent must discover the skill on its own or another model-invoked workflow needs it.

- **Model-invoked:** keep a narrow model-facing `description`; omit `disable-model-invocation`.
- **User-only:** set `disable-model-invocation: true`; make `description` a short human-facing label without trigger stuffing.

User-only skills spend no always-loaded description budget but depend on the user remembering them. Convert operational, destructive, credential-writing, or deliberately heavyweight workflows to user-only unless autonomous invocation is essential.

Invocation mechanics differ across harnesses. Verify the installed harness documentation before claiming cross-skill calls, discovery roots, or frontmatter fields are portable.

## Progressive disclosure

Keep universal steps in `SKILL.md`. Put optional modes and substantial reference material in sibling files with an explicit condition for loading each one. Shared material needed by several user-only skills belongs in a plain reference file that each can link directly.

## Router skills

When several user-only skills form one memorable family, a small user-only router may list when to invoke each. The router guides the human; do not claim it can automatically invoke skills whose harness hides them from model discovery.
