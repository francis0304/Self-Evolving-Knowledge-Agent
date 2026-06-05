#!/usr/bin/env node

// Simple test to verify the server can start and respond
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing Obsidian MCP Server...\n');

const serverPath = join(__dirname, 'dist', 'index.js');
const vaultPath = join(__dirname, '..');

const server = spawn('node', [serverPath], {
  env: {
    ...process.env,
    OBSIDIAN_VAULT_PATH: vaultPath,
  },
  stdio: ['pipe', 'pipe', 'pipe'],
});

let output = '';

server.stdout.on('data', (data) => {
  output += data.toString();
  console.log('STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  console.log('STDERR:', data.toString());
});

// Send initialize request
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  console.log('Sending initialize request...');
  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // Wait for response, then request tools list
  setTimeout(() => {
    const toolsRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    };

    console.log('Sending tools/list request...');
    server.stdin.write(JSON.stringify(toolsRequest) + '\n');

    // Wait for response, then exit
    setTimeout(() => {
      console.log('\nTest complete!');
      server.kill();
      process.exit(0);
    }, 1000);
  }, 1000);
}, 1000);

server.on('close', (code) => {
  console.log(`\nServer exited with code ${code}`);
});

setTimeout(() => {
  console.log('\nTest timed out!');
  server.kill();
  process.exit(1);
}, 5000);
