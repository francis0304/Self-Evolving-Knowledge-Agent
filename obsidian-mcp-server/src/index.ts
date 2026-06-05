#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import { watch } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH || path.resolve(__dirname, "../..");

interface Note {
  path: string;
  title: string;
  content: string;
}

// Cache state
const noteCache = new Map<string, Note>();
const backlinkIndex = new Map<string, Set<string>>(); // targetTitle.toLowerCase() -> Set of relativePaths
const noteOutboundLinks = new Map<string, string[]>(); // relativePath -> outbound links (original case)
let isCacheLoaded = false;

// Helper to update backlinks when a note is added/modified
function addNoteToBacklinks(relativePath: string, content: string): void {
  const links = extractWikiLinks(content);
  noteOutboundLinks.set(relativePath, links);
  for (const link of links) {
    const key = link.toLowerCase();
    let set = backlinkIndex.get(key);
    if (!set) {
      set = new Set<string>();
      backlinkIndex.set(key, set);
    }
    set.add(relativePath);
  }
}

// Helper to remove note references from backlinks (before updating or on deletion)
function removeNoteFromBacklinks(relativePath: string): void {
  const oldLinks = noteOutboundLinks.get(relativePath);
  if (oldLinks) {
    for (const link of oldLinks) {
      const key = link.toLowerCase();
      const set = backlinkIndex.get(key);
      if (set) {
        set.delete(relativePath);
        if (set.size === 0) {
          backlinkIndex.delete(key);
        }
      }
    }
    noteOutboundLinks.delete(relativePath);
  }
}

// Helper to normalize Windows slash directions
function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

// Check if a path is inside the vault safely (case-insensitive for Windows)
function isPathInsideVault(fullPath: string): boolean {
  const canonicalVault = path.normalize(VAULT_PATH).toLowerCase();
  const canonicalFull = path.normalize(fullPath).toLowerCase();
  return canonicalFull.startsWith(canonicalVault);
}

// Helper functions
async function getAllMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip hidden directories, node_modules, and .obsidian config folder
    if (
      entry.isDirectory() && 
      !entry.name.startsWith(".") && 
      entry.name !== "node_modules" &&
      entry.name !== ".obsidian"
    ) {
      files.push(...(await getAllMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function loadCache(): Promise<void> {
  console.error("Populating note cache...");
  const files = await getAllMarkdownFiles(VAULT_PATH);
  for (const file of files) {
    try {
      const content = await fs.readFile(file, "utf-8");
      const relativePath = normalizePath(path.relative(VAULT_PATH, file));
      const title = path.basename(file, ".md");
      noteCache.set(relativePath, {
        path: relativePath,
        title,
        content
      });
      addNoteToBacklinks(relativePath, content);
    } catch (error) {
      console.error(`Error caching ${file}:`, error);
    }
  }
  isCacheLoaded = true;
  console.error(`Cache populated with ${noteCache.size} notes.`);
}

function startFileWatcher(): void {
  try {
    watch(VAULT_PATH, { recursive: true }, async (eventType, filename) => {
      if (!filename) return;
      const normalizedFilename = normalizePath(filename);
      
      // Skip hidden folders, node_modules, .obsidian, and obsidian-mcp-server folder itself
      if (
        normalizedFilename.startsWith(".") ||
        normalizedFilename.includes("node_modules") ||
        normalizedFilename.includes(".obsidian") ||
        normalizedFilename.includes("obsidian-mcp-server") ||
        !normalizedFilename.endsWith(".md")
      ) {
        return;
      }

      const fullPath = path.resolve(VAULT_PATH, normalizedFilename);
      const relativePath = normalizePath(path.relative(VAULT_PATH, fullPath));

      try {
        const stats = await fs.stat(fullPath);
        if (stats.isFile()) {
          const content = await fs.readFile(fullPath, "utf-8");
          const title = path.basename(fullPath, ".md");
          
          removeNoteFromBacklinks(relativePath);
          noteCache.set(relativePath, {
            path: relativePath,
            title,
            content
          });
          addNoteToBacklinks(relativePath, content);
          console.error(`Watcher: Updated cache for ${relativePath}`);
        }
      } catch (error) {
        // File does not exist, so it was deleted
        removeNoteFromBacklinks(relativePath);
        if (noteCache.delete(relativePath)) {
          console.error(`Watcher: Removed from cache ${relativePath}`);
        }
      }
    });
    console.error("File watcher started successfully.");
  } catch (error) {
    console.error("Failed to start file watcher:", error);
  }
}

async function searchNotes(query: string): Promise<Note[]> {
  if (!isCacheLoaded) await loadCache();
  const results: Note[] = [];
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  if (tokens.length === 0) return [];

  for (const [relativePath, note] of noteCache.entries()) {
    const titleLower = note.title.toLowerCase();
    const contentLower = note.content.toLowerCase();
    
    // Match only if every token is present in either the title or the content
    const isMatch = tokens.every(token => titleLower.includes(token) || contentLower.includes(token));
    
    if (isMatch) {
      results.push({
        path: relativePath,
        title: note.title,
        content: note.content.substring(0, 500), // Preview
      });
    }
  }

  return results;
}

async function readNote(notePath: string): Promise<Note> {
  const fullPath = path.resolve(VAULT_PATH, notePath);
  const relativePath = normalizePath(path.relative(VAULT_PATH, fullPath));

  // Security: ensure path is within vault
  if (!isPathInsideVault(fullPath)) {
    throw new Error("Invalid path: outside vault");
  }

  if (!isCacheLoaded) await loadCache();

  // Try to get from cache first
  const cachedNote = noteCache.get(relativePath);
  if (cachedNote) {
    return cachedNote;
  }

  // Fallback to disk if cache miss
  const content = await fs.readFile(fullPath, "utf-8");
  const title = path.basename(fullPath, ".md");
  const note = {
    path: relativePath,
    title,
    content,
  };
  
  noteCache.set(relativePath, note);
  return note;
}

async function writeNote(notePath: string, content: string): Promise<void> {
  const fullPath = path.resolve(VAULT_PATH, notePath);
  const relativePath = normalizePath(path.relative(VAULT_PATH, fullPath));

  // Security: ensure path is within vault
  if (!isPathInsideVault(fullPath)) {
    throw new Error("Invalid path: outside vault");
  }

  // Ensure directory exists
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");

  removeNoteFromBacklinks(relativePath);

  // Sync cache immediately to ensure read-after-write consistency
  const title = path.basename(fullPath, ".md");
  noteCache.set(relativePath, {
    path: relativePath,
    title,
    content,
  });

  addNoteToBacklinks(relativePath, content);
}

function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    let rawLink = match[1];

    // Handle piped display names: [[Note Path|Display Label]] -> "Note Path"
    const pipeIndex = rawLink.indexOf('|');
    if (pipeIndex !== -1) {
      rawLink = rawLink.substring(0, pipeIndex);
    }

    // Handle section/block anchors: [[Note Path#Section]] -> "Note Path"
    const hashIndex = rawLink.indexOf('#');
    if (hashIndex !== -1) {
      rawLink = rawLink.substring(0, hashIndex);
    }

    const cleaned = rawLink.trim();
    if (cleaned) {
      // Extract the base name (title) of the link target
      const title = path.basename(cleaned, ".md");
      links.push(title);
    }
  }

  return links;
}

async function findNoteByTitle(title: string): Promise<string | null> {
  if (!isCacheLoaded) await loadCache();

  for (const [relativePath, note] of noteCache.entries()) {
    if (note.title === title) {
      return relativePath;
    }
  }

  return null;
}

async function getBacklinks(notePath: string): Promise<string[]> {
  if (!isCacheLoaded) await loadCache();
  const targetTitle = path.basename(notePath, ".md").toLowerCase();
  const backlinksSet = backlinkIndex.get(targetTitle);
  return backlinksSet ? Array.from(backlinksSet) : [];
}


// Define tools
const tools: Tool[] = [
  {
    name: "search_notes",
    description: "Search for notes in the Obsidian vault by content or title. Returns matching notes with previews.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to match against note titles and content",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "read_note",
    description: "Read the full content of a specific note by its path (e.g., 'projects/Reporting API.md')",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the note within the vault",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "write_note",
    description: "Create a new note or update an existing one",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path where the note should be saved (e.g., 'projects/new-project.md')",
        },
        content: {
          type: "string",
          description: "The full content of the note in Markdown format",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "get_links",
    description: "Get all wiki-links [[like this]] from a note and find their actual file paths",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the note",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "get_backlinks",
    description: "Find all notes that link to this note",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path to the note",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "list_notes",
    description: "List all notes in the vault with their paths",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Create server
const server = new Server(
  {
    name: "obsidian-vault-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool list requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_notes": {
        const { query } = args as { query: string };
        const results = await searchNotes(query);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case "read_note": {
        const { path: notePath } = args as { path: string };
        const note = await readNote(notePath);
        return {
          content: [
            {
              type: "text",
              text: note.content,
            },
          ],
        };
      }

      case "write_note": {
        const { path: notePath, content } = args as { path: string; content: string };
        await writeNote(notePath, content);
        return {
          content: [
            {
              type: "text",
              text: `Successfully wrote note to ${notePath}`,
            },
          ],
        };
      }

      case "get_links": {
        const { path: notePath } = args as { path: string };
        const note = await readNote(notePath);
        const links = extractWikiLinks(note.content);

        // Resolve wiki-links to actual file paths
        const resolvedLinks = await Promise.all(
          links.map(async (link) => {
            const filePath = await findNoteByTitle(link);
            return { link, filePath };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(resolvedLinks, null, 2),
            },
          ],
        };
      }

      case "get_backlinks": {
        const { path: notePath } = args as { path: string };
        const backlinks = await getBacklinks(notePath);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(backlinks, null, 2),
            },
          ],
        };
      }

      case "list_notes": {
        if (!isCacheLoaded) await loadCache();
        const notes = Array.from(noteCache.values()).map((note) => ({
          path: note.path,
          title: note.title,
        }));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(notes, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  // Pre-populate cache on startup so tools respond instantly
  await loadCache().catch(err => console.error("Initial cache load failed:", err));
  startFileWatcher();

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Obsidian Vault MCP Server running on ${VAULT_PATH}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
