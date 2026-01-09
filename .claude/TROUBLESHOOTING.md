# Skills Troubleshooting Guide

This document explains known issues with Claude Code skills and their workarounds.

## Known Issues

### Issue 1: `/skills` Command Doesn't List Custom Skills

**Status:** Known Bug (GitHub Issue #14733)

**Symptoms:**
- Running `/skills` shows only built-in Claude Code skills
- Custom skills from `.claude/skills/` don't appear in the list
- Skills may still work when invoked directly

**Root Cause:**
The `/skills` command has a bug where it only displays built-in skills, not user-provided skills from the `.claude/skills/` directory.

**Workaround:**
1. **Use skills directly** - Type `/skill-name` to invoke them
2. **Check this project's skills** - Run `/skills-list` to see all project skills
3. **Verify skill files exist:**
   ```bash
   ls -la .claude/skills/
   ```

**References:**
- [GitHub Issue #14733](https://github.com/anthropics/claude-code/issues/14733)
- [Blog post about skill visibility](https://blog.fsck.com/2025/12/17/claude-code-skills-not-triggering/)

---

### Issue 2: Skills Not Triggering (Token Budget Exceeded)

**Status:** Feature Limitation

**Symptoms:**
- Claude doesn't use skills even when invoked
- Skills appear to be ignored
- `/skills` shows no skills or only built-in ones

**Root Cause:**
Claude Code has a default **15,000 character limit** for skill descriptions. When exceeded:
- Skills are silently dropped from the system prompt
- Claude is instructed not to use skills that aren't listed
- No warning is given when the limit is exceeded

**Diagnosis:**
Check your total skill description character count:
```bash
cd .claude/skills
for skill in */skill.json; do
  echo "$skill:"
  jq -r '.description' "$skill" | wc -c
done
```

**Solutions:**

1. **Increase the budget (Recommended):**
   ```bash
   # Double the character budget to 30,000
   export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000

   # Or set it permanently in your shell profile (~/.zshrc or ~/.bashrc)
   echo 'export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Shorten skill descriptions:**
   - Keep descriptions under 150 characters each
   - Focus on what the skill does, not how
   - Put detailed info in `instructions.md`

3. **Reduce number of skills:**
   - Combine related skills
   - Remove unused skills

**Current Status:**
This project's skills have optimized descriptions (~100-150 chars each) and should work with the default budget. However, setting `SLASH_COMMAND_TOOL_CHAR_BUDGET=30000` provides extra headroom.

---

## Verifying Skills Work

### Test Individual Skills

Each skill can be tested by invoking it directly:

```bash
# Test setup-testing skill
/setup-testing --testing-framework vitest

# Test gitflow skill
/gitflow status

# Test create-plugin skill
/create-plugin test-plugin --sub-features items
```

### Check Skill Files

Verify skill structure is correct:

```bash
# Each skill should have:
.claude/skills/{skill-name}/
├── skill.json          # Metadata with commandName
└── instructions.md     # Implementation instructions

# Verify commandName exists
jq '.commandName' .claude/skills/*/skill.json
```

### Manual Skill Invocation

If slash commands don't work, you can manually trigger skills by:

1. Reading the skill's `instructions.md`
2. Copying the content to Claude
3. Asking Claude to follow those instructions

---

## Best Practices

### 1. Keep Descriptions Concise

❌ **Too long:**
```json
{
  "description": "Set up a comprehensive testing infrastructure for this Next.js 16 project using Vitest testing framework along with React Testing Library for component testing, including configuration files, test utilities, example tests, and pre-commit hooks to ensure code quality."
}
```

✅ **Better:**
```json
{
  "description": "Set up complete testing infrastructure with Vitest, React Testing Library, and pre-commit hooks"
}
```

### 2. Use the Environment Variable

Always set `SLASH_COMMAND_TOOL_CHAR_BUDGET` to avoid issues:

```bash
# Add to ~/.zshrc or ~/.bashrc
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000
```

### 3. Test Skills Individually

Don't rely on `/skills` to show your custom skills. Test each one directly.

### 4. Document Your Skills

Keep a `README.md` in `.claude/skills/` listing all skills and their usage.

---

## Getting Help

If skills still don't work:

1. **Check Claude Code version:**
   ```bash
   /status
   ```

2. **Verify environment variable:**
   ```bash
   echo $SLASH_COMMAND_TOOL_CHAR_BUDGET
   ```

3. **Check skill files exist:**
   ```bash
   ls -la .claude/skills/
   ```

4. **Review logs:** Look for any error messages when starting Claude Code

5. **Report issues:** Check if your issue is already reported on GitHub:
   - [GitHub Issue #14577](https://github.com/anthropics/claude-code/issues/14577) - /skills shows "No skills found"
   - [GitHub Issue #14733](https://github.com/anthropics/claude-code/issues/14733) - User skills not appearing

---

## Quick Reference

### Fix Skills Not Appearing

```bash
# 1. Increase character budget
export SLASH_COMMAND_TOOL_CHAR_BUDGET=30000

# 2. Restart Claude Code
# Exit and restart Claude

# 3. Test a skill
/setup-testing
```

### List Project Skills

```bash
# Use the custom command
/skills-list

# Or check the README
cat .claude/skills/README.md
```

### Verify Skill Structure

```bash
# Check all skills have commandName
for f in .claude/skills/*/skill.json; do
  name=$(jq -r '.name' "$f")
  cmd=$(jq -r '.commandName // "MISSING"' "$f")
  echo "$name: commandName=$cmd"
done
```

---

**Last Updated:** 2025-01-08
**Claude Code Version:** 2.0.73+
**Project:** Next.js 16 Enterprise Boilerplate
