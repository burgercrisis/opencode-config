---
name: session-review
description: Guide for investigating OpenCode sessions using OCS CLI to understand what agents did
---

## What I Do

Guide you through investigating OpenCode sessions using OCS (OpenCode Sessions) CLI to understand:

- **What sessions exist** - Search and filter sessions by project, time, or content
- **What happened in a session** - Read session flow (user prompts → AI responses → tool calls)
- **What specific messages did** - Drill into individual messages for full details
- **How agents operated** - Review reasoning, tool calls, file changes, and outputs

## The OCS CLI Tool

The OCS CLI (`ocs.ts`) is a standalone script that reads directly from `~/.local/share/opencode/storage/`.

### Commands

Run OCS directly with node:

```bash
# List all sessions
node ocs.ts list

# Print session (compact mode - default)
node ocs.ts <session_id>

# Print session (full mode)
node ocs.ts <session_id> --full

# Print specific message (full details)
node ocs.ts <session_id> --msg <message_id>

# Short form flags
node ocs.ts <session_id> -f              # Full session mode
node ocs.ts <session_id> -m <msg_id> # Message full mode
node ocs.ts ls                          # List sessions
```

### Always Use Filters

The session list can be hundreds of items. ALWAYS pipe to grep/head:

```bash
# Global sessions only
node ocs.ts list | grep "[global]"

# Sessions from specific project directory
node ocs.ts list | grep "/path/to/project"

# Search by title/content
node ocs.ts list | grep -i "dashboard"

# Limit output
node ocs.ts list | head -20
node ocs.ts list | tail -50
```

### Output Format

**Session list format:**
```
SESSION_ID [/path/to/dir or global] DATE TITLE
```

**Compact mode (default):**
- Shows full user text
- Shows AI tool calls compactly (type + file/command, no full output)
- NO reasoning/thinking steps
- NO full tool outputs
- Example: `tool call : READ : /path/to/file.ts`

**Full mode (--full):**
- Shows everything including reasoning, tool metadata, step details

**Specific message mode (--msg):**
- Shows full details of ONE message only
- All parts including reasoning
- Complete tool input/output (not truncated)
- Step costs and token counts

## When to Use Me

### Scenarios

1. **Understanding what happened in a project**
   - List sessions for that project
   - Review recent sessions to see recent activity
   - Check session flow to understand the work done

2. **Investigating a bug or issue**
   - Find sessions with relevant keywords
   - Review the session flow to understand agent actions
   - Drill into specific messages to see exact tool calls and outputs

3. **Reviewing agent behavior**
   - Compact mode: Quick overview of actions
   - Full mode: See reasoning and thinking process
   - Message drill-down: Inspect specific tool calls/results

4. **Checking what changed**
   - Look for tool calls like `EDIT`, `WRITE`, `PATCH`
   - See reasoning to understand why changes were made
   - Verify file paths and operations

### Investigation Workflow

1. **Find relevant sessions:**
   ```bash
   # List all and filter
   node ocs.ts list | grep "/path/to/project"

   # Search by topic
   node ocs.ts list | grep -i "fix|bug|feature"

   # Filter by time (most recent are first)
   node ocs.ts list | head -10
   ```

2. **Review session flow:**
   ```bash
   # Start with compact mode to understand overall flow
   node ocs.ts <session_id>

   # Look for key actions:
   # - tool call : BASH : <command>
   # - tool call : READ : <file>
   # - tool call : EDIT : <file>
   # - tool call : WRITE : <file>
   ```

3. **Deep dive when needed:**
   ```bash
   # See reasoning for specific assistant message
   node ocs.ts <session_id> -f | grep -A 20 "msg_<id>"

   # Inspect a specific tool call
   node ocs.ts <session_id> -m msg_<message_id>
   ```

### Reading Session Output

**Compact mode is ideal for:**
- Quickly understanding what was done
- Seeing file operations (reads, edits, writes)
- Following the conversation flow
- Identifying when errors occurred

**Full mode for:**
- Understanding WHY changes were made (reasoning)
- Seeing complete tool input/output for debugging
- Reviewing token usage and costs
- Understanding step-by-step process

**Message drill-down for:**
- Investigating specific tool failures
- Seeing exact file content reads
- Reviewing complete bash command output
- Understanding token counts per operation

### Key Patterns to Spot

In compact mode, look for:

- **tool call : EDIT** - File was modified (what changed?)
- **tool call : WRITE** - New file created
- **tool call : READ** - File was read (context gathering)
- **tool call : BASH** - Commands were executed
- **─ step start** / **─ step finish** - Operation boundaries

If you see an error or unexpected result, use `--msg` to drill into that specific message with full details.

## Notes

- Sessions are stored in `~/.local/share/opencode/storage/`
- No OpenCode server needs to be running
- OCS reads JSON files directly
- Compact mode is much faster for large sessions
- Use `less` for pagination: `node ocs.ts <id> --full | less`
- Copy session/message IDs from the output directly