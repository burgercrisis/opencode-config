/**
 * OCS - OpenCode Sessions CLI
 *
 * Run with: node ocs.ts [COMMAND] [ARGS]
 *
 * Read session data directly from ~/.local/share/opencode/storage/
 */

import { readdir, readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const STORAGE_ROOT = process.env.HOME + "/.local/share/opencode/storage"
let FULL_MODE = false

interface SessionInfo {
  id: string
  title: string
  directory: string
  projectID: string
  time: {
    created: number
    updated: number
  }
}

interface MessageInfo {
  id: string
  role: "user" | "assistant"
  time: { created: number; completed?: number }
  agent?: string
  model?: { providerID: string; modelID: string }
}

interface Part {
  id: string
  type: string
  text?: string
  prompt?: string
  tool?: string
  callID?: string
  state?: any
  synthetic?: boolean
  ignored?: boolean
  filename?: string
  reason?: string
  snapshot?: any
}

async function getAllSessions(): Promise<SessionInfo[]> {
  const sessions: SessionInfo[] = []
  const sessionRoot = join(STORAGE_ROOT, "session")

  const projectDirs = await readdir(sessionRoot)

  for (const projectDir of projectDirs) {
    const projectPath = join(sessionRoot, projectDir)
    const files = await readdir(projectPath)

    for (const file of files) {
      if (!file.endsWith(".json")) continue
      const filePath = join(projectPath, file)
      const content = await readFile(filePath, "utf-8")
      const session: SessionInfo & { projectID?: string } = JSON.parse(content)
      if (!session.projectID) session.projectID = projectDir
      sessions.push(session)
    }
  }

  return sessions.sort((a, b) => b.time.updated - a.time.updated)
}

async function getMessageFiles(sessionID: string): Promise<MessageInfo[]> {
  const msgDir = join(STORAGE_ROOT, "message", sessionID)
  if (!existsSync(msgDir)) return []

  const files = await readdir(msgDir)
  const messages: MessageInfo[] = []

  for (const file of files) {
    if (!file.endsWith(".json")) continue
    const filePath = join(msgDir, file)
    const content = await readFile(filePath, "utf-8")
    messages.push(JSON.parse(content))
  }

  return messages.sort((a, b) => a.time.created - b.time.created)
}

async function getParts(messageID: string): Promise<Part[]> {
  const partDir = join(STORAGE_ROOT, "part", messageID)
  if (!existsSync(partDir)) return []

  const files = await readdir(partDir)
  const parts: Part[] = []

  for (const file of files) {
    if (!file.endsWith(".json")) continue
    const filePath = join(partDir, file)
    const content = await readFile(filePath, "utf-8")
    parts.push(JSON.parse(content))
  }

  return parts
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

function isGlobalProject(projectID: string): boolean {
  return projectID === "global"
}

// CLI Commands
async function listSessions() {
  const sessions = await getAllSessions()

  console.log(`\n${sessions.length} sessions:\n`)

  for (const session of sessions) {
    const projectDisplay = isGlobalProject(session.projectID)
      ? "[global]"
      : `[${session.directory}]`

    console.log(`${cyan(session.id)} ${projectDisplay} ${formatDate(session.time.updated)} ${session.title}`)
  }

  console.log()
}

function printCompactPart(part: Part) {
  switch (part.type) {
    case "text":
      if (!part.ignored) {
        const lines = part.text || ""
        const splitLines = lines.split("\n")
        if (splitLines.length > 5) {
          console.log(gray(splitLines.slice(0, 5).join("\n")))
          console.log(gray(`... (${splitLines.length - 5} more lines)`))
        } else {
          console.log(gray(lines))
        }
        console.log()
      }
      break

    case "tool":
      const input = part.state?.input || {}
      const value = Object.values(input)[0] as string // Get first value (file, command, etc.)

      if (part.tool === "bash") {
        const cmd = input.command || input.script || ""
        console.log(`${blue("tool call")} : BASH : ${cyan(cmd.substring(0, 100))}${cmd.length > 100 ? "..." : ""}`)
      } else if (part.tool === "editor" && input.file) {
        const op = input.operation || "edit"
        console.log(`${blue("tool call")} : ${op.toUpperCase()} : ${cyan(input.file)}`)
      } else if (part.tool === "read" && value) {
        console.log(`${blue("tool call")} : READ : ${cyan(value)}`)
      } else if (part.tool === "write" && value) {
        console.log(`${blue("tool call")} : WRITE : ${cyan(value)}`)
      } else if (value) {
        console.log(`${blue("tool call")} : ${part.tool?.toUpperCase()} : ${cyan(value)}`)
      } else {
        console.log(`${blue("tool call")} : ${part.tool?.toUpperCase()}`)
      }
      break

    case "reasoning":
      // Compact mode: skip reasoning
      break

    case "file":
      if (part.filename) {
        console.log(`${green("file")} : ${cyan(part.filename)}`)
      }
      break

    case "step-start":
      console.log(magenta("─ step start ─"))
      break

    case "step-finish":
      if (part.reason) console.log(magenta(`─ step finish : ${part.reason}`))
      else console.log(magenta("─ step finish ─"))
      break

    default:
      // Skip other parts in compact mode
      break
  }
}

function printFullPart(part: Part) {
  switch (part.type) {
    case "text":
      if (part.ignored) return
      console.log(`${gray("─ text ─")}`)
      console.log(part.text || "")
      console.log()
      break

    case "subtask":
      console.log(`${cyan("─ subtask ─")}`)
      console.log(`   Prompt: ${part.prompt?.substring(0, 100)}...`)
      if (part.description) console.log(`   Description: ${part.description}`)
      console.log()
      break

    case "reasoning":
      console.log(`${magenta("─ reasoning ─")}`)
      console.log(part.text || "")
      console.log()
      break

    case "tool":
      const toolIcon = part.state?.status === "completed" ? "✅" : part.state?.status === "error" ? "❌" : "⏳"
      console.log(`${blue("─ tool call ─")} ${toolIcon} ${part.tool}`)

      if (part.callID) console.log(`   Call ID: ${part.callID}`)

      // Show input info, NOT full output
      if (part.state?.input) {
        console.log(`   Input: ${JSON.stringify(part.state.input, null, 2).substring(0, 200)}...`)
      }

      // Show metadata but NOT full output
      if (part.state?.status === "completed") {
        console.log(`   Status: completed`)
        if (part.state?.metadata) {
          console.log(`   Metadata: ${JSON.stringify(part.state.metadata, null, 2)}`)
        }
        console.log(`   ${gray("(full output omitted - too large)")}`)
      } else if (part.state?.status === "error") {
        console.log(`   Status: error`)
        if (part.state?.error) {
          console.log(`   Error: ${part.state.error}`)
        }
      } else {
        console.log(`   Status: ${part.state?.status || "running"}`)
      }

      console.log()
      break

    case "file":
      console.log(`${green("─ file ─")}`)
      console.log(`   MIME: ${part.mime}`)
      if (part.filename) console.log(`   Filename: ${part.filename}`)
      if (part.url) console.log(`   URL: ${part.url}`)
      console.log()
      break

    case "step-start":
      console.log(`${cyan("─ step start ─")}`)
      console.log(`   Snapshot: ${part.snapshot ? "yes" : "no"}`)
      console.log()
      break

    case "step-finish":
      console.log(`${cyan("─ step finish ─")}`)
      if (part.reason) console.log(`   Reason: ${part.reason}`)
      if (part.cost !== undefined) console.log(`   Cost: $${part.cost.toFixed(4)}`)
      if (part.tokens) {
        console.log(`   Tokens: ${JSON.stringify(part.tokens)}`)
      }
      console.log()
      break

    case "patch":
      console.log(`${green("─ patch ─")}`)
      console.log(`   Hash: ${part.hash}`)
      if (part.files) {
        console.log(`   Files (${part.files.length}):`)
        for (const file of part.files) {
          console.log(`     - ${file}`)
        }
      }
      console.log()
      break

    case "compaction":
      console.log(`${magenta("─ compaction ─")}`)
      if (part.auto !== undefined) console.log(`   Auto: ${part.auto}`)
      console.log()
      break

    case "retry":
      console.log(`${yellow("─ retry ─")}`)
      console.log(`   Attempt: ${part.attempt}`)
      if (part.error) console.log(`   Error: ${part.error}`)
      console.log()
      break

    case "agent":
      console.log(`${cyan("─ agent ─")}`)
      console.log(`   Name: ${part.name}`)
      if (part.source) console.log(`   Source: ${part.source}`)
      console.log()
      break

    case "snapshot":
      console.log(`${cyan("─ snapshot ─")}`)
      console.log(`   ${gray("(snapshot data omitted)")}`)
      console.log()
      break

    default:
      console.log(`${gray(`─ ${part.type} ─`)}`)
      console.log(JSON.stringify(part, null, 2))
      console.log()
  }
}

async function printSession(sessionID: string) {
  console.log(`\n${bold("Session: " + sessionID)}\n`)

  const messages = await getMessageFiles(sessionID)

  if (messages.length === 0) {
    console.log("No messages found.")
    return
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const parts = await getParts(msg.id)

    const icon = msg.role === "user" ? "👤" : "🤖"
    const roleColor = msg.role === "user" ? cyan : yellow

    console.log(`${"─".repeat(80)}`)
    console.log(`${icon} ${roleColor(bold(msg.role.toUpperCase()))} - ${msg.id}`)

    // Show full metadata for all messages
    if (msg.agent) console.log(`   Agent: ${msg.agent}`)
    if (msg.model) console.log(`   Model: ${msg.model.providerID}/${msg.model.modelID}`)
    console.log(`   Time: ${formatDate(msg.time.created)}${msg.time.completed ? ` → ${formatDate(msg.time.completed)}` : ""}`)
    console.log()

    // User messages: always show full text
    if (msg.role === "user") {
      for (const part of parts) {
        if (part.type === "text" && !part.ignored) {
          console.log(part.text || "")
          console.log()
        }
      }
    }
    // Assistant messages: show parts
    else if (msg.role === "assistant") {
      if (FULL_MODE) {
        // Full mode: show all parts
        for (const part of parts) {
          printFullPart(part)
        }
      } else {
        // Compact mode: show tool calls compactly, skip reasoning
        for (const part of parts) {
          printCompactPart(part)
        }
      }
    }

    console.log()
  }
}

async function printMessage(sessionID: string, messageID: string) {
  console.log(`\n${bold("Message: " + messageID)}\n`)

  const messages = await getMessageFiles(sessionID)
  const msg = messages.find(m => m.id === messageID)

  if (!msg) {
    console.log(`Message ${messageID} not found in session ${sessionID}`)
    return
  }

  const parts = await getParts(msg.id)

  const icon = msg.role === "user" ? "👤" : "🤖"
  const roleColor = msg.role === "user" ? cyan : yellow

  console.log(`${"─".repeat(80)}`)
  console.log(`${icon} ${roleColor(bold(msg.role.toUpperCase()))} - ${msg.id}`)

  // Show full metadata
  if (msg.agent) console.log(`   Agent: ${msg.agent}`)
  if (msg.model) console.log(`   Model: ${msg.model.providerID}/${msg.model.modelID}`)
  console.log(`   Time: ${formatDate(msg.time.created)}${msg.time.completed ? ` → ${formatDate(msg.time.completed)}` : ""}`)
  console.log()

  // Show all parts in full detail
  console.log(`${bold("ALL PARTS (FULL MODE)")}:\n`)
  for (const part of parts) {
    printFullPart(part)
  }

  console.log()
}

// Terminal colors
function cyan(str: string): string {
  return `\x1b[36m${str}\x1b[0m`
}

function yellow(str: string): string {
  return `\x1b[33m${str}\x1b[0m`
}

function green(str: string): string {
  return `\x1b[32m${str}\x1b[0m`
}

function blue(str: string): string {
  return `\x1b[34m${str}\x1b[0m`
}

function magenta(str: string): string {
  return `\x1b[35m${str}\x1b[0m`
}

function gray(str: string): string {
  return `\x1b[90m${str}\x1b[0m`
}

function bold(str: string): string {
  return `\x1b[1m${str}\x1b[0m`
}

// Parse args
const args = process.argv.slice(2)

async function showHelp() {
  console.log(`
${bold("OCS - OpenCode Sessions CLI")}

${bold("USAGE:")}
  bun ocs.ts ls                           # List all sessions (short)
  bun ocs.ts list                           # List all sessions
  bun ocs.ts <session_id>                   # Print session (compact mode)
  bun ocs.ts <session_id> -f                # Print session (full mode, short)
  bun ocs.ts <session_id> --full            # Print session (full mode)
  bun ocs.ts <session_id> -m <msg_id>       # Print specific message (full details, short)
  bun ocs.ts <session_id> --msg <msg_id>    # Print specific message (full details)

${bold("SESSION LIST:")}

  Format: ${green("SESSION_ID [/path/to/dir or global] DATE TITLE")}

  ${gray("Examples:")}
  ${cyan("ses_41f5f803bffeYc6BKH9MBNzMzS [global] 1/21/2026 Investigate session storage")}
  ${cyan("ses_420261333ffe5bNNu4X1a4w4If [/home/idc/proj/bit] 1/21/2026 Reading http server")}

  ${yellow("⚠️  IMPORTANT: Use with grep/head to filter!")}
  ${gray("The list can be very long. Examples:")}

    # Global sessions only
    bun ocs.ts list | grep "[global]"

    # Sessions from a specific directory
    bun ocs.ts list | grep "/home/idc/proj/bit"

    # Search by title
    bun ocs.ts list | grep -i "dashboard"

    # Show first 10 sessions only
    bun ocs.ts list | head -10

${bold("PRINT SESSION (COMPACT MODE - DEFAULT):")}

  bun ocs.ts <session_id>

  Shows: user prompt → AI response → compact tool calls

  ${gray("Compact mode shows:")}
    - User prompt (full text)
    - AI tool calls (type + file/command, not full output)
    - No reasoning/thinking
    - No full tool outputs

  ${gray("Example output:")}
  ${cyan("tool call : BASH : ls -la")}
  ${cyan("tool call : EDIT : /path/to/file.ts")}
  ${cyan("tool call : WRITE : /path/to/file.ts")}

${bold("PRINT SESSION (FULL MODE):")}

  bun ocs.ts <session_id> --full

  Shows: everything (reasoning, full tool metadata, etc.)

  ${yellow("⚠️  WARNING: This can print A LOT of content!")}
  ${gray("For large sessions, pipe to less or head: ")}
    bun ocs.ts ses_... --full | less
    bun ocs.ts ses_... --full | head -100

${bold("PRINT SPECIFIC MESSAGE (FULL DETAILS):")}

  bun ocs.ts <session_id> --msg <msg_id>

  Shows: everything about one specific message (all parts, reasoning, full tool output)

  ${gray("Examples:")}
    bun ocs.ts ses_abc123 --msg msg_xyz789

${bold("EXAMPLES:")}
  # Find a dashboard session (copy the session ID)
  bun ocs.ts list | grep -i dashboard

  # Print that specific session (compact mode)
  bun ocs.ts <copied_session_id>

  # Print in full mode with pagination
  bun ocs.ts <copied_session_id> --full | less

  # View full details of a specific message
  bun ocs.ts <session_id> --msg <message_id>
`)
  process.exit(0)
}

async function main() {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    await showHelp()
  }

  // Check for --full or -f flag
  if (args.includes("--full") || args.includes("-f")) {
    FULL_MODE = true
    const index = args.indexOf("--full")
    if (index !== -1) args.splice(index, 1)
    else args.splice(args.indexOf("-f"), 1)
  }

  // Check for --msg or -m flag
  let msgIndex = args.indexOf("--msg")
  if (msgIndex === -1) {
    msgIndex = args.indexOf("-m")
  }
  const specificMessageID = msgIndex !== -1 ? args[msgIndex + 1] : undefined

  if (args[0] === "list" || args[0] === "ls") {
    await listSessions()
  } else if (args[0].startsWith("ses_")) {
    const sessionID = args[0]

    if (specificMessageID) {
      // Print specific message
      await printMessage(sessionID, specificMessageID)
    } else {
      // Print session
      await printSession(sessionID)
    }
  } else {
    console.log("Invalid command. Run: ocs --help\n")
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})