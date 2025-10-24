import { createFromRoot } from 'codama';
import { rootNodeFromAnchor } from '@codama/nodes-from-anchor';
import { renderVisitor as renderJavaScriptVisitor } from '@codama/renderers-js';
import renderDartVisitor from '@codama/renderers-dart';
import { renderVisitor as renderRustVisitor } from '@codama/renderers-rust';
import path from 'path';
import fs from 'fs';

// Load the IDL files explicitly
const anchorGambleIdl = JSON.parse(fs.readFileSync('target/idl/anchor_gamble.json', 'utf8'));
const anchorCounterIdl = JSON.parse(fs.readFileSync('target/idl/counter.json', 'utf8'));
const anchorSplEscrowIdl = JSON.parse(fs.readFileSync('target/idl/spl_escrow.json', 'utf8'));
const anchorDataStructuresIdl = JSON.parse(fs.readFileSync('target/idl/data_structures.json', 'utf8'));
const testCpiIdl = JSON.parse(fs.readFileSync('target/idl/test_cpi.json', 'utf8'));


// Output base path for generated clients
const BASE_CLIENTS_PATH = 'clients';

// Define the IDLs and their corresponding program names
const idls = [
    // { idl: anchorGambleIdl, name: 'anchor_gamble' },
    // { idl: anchorCounterIdl, name: 'anchor_counter' },
    { idl: anchorSplEscrowIdl, name: 'anchor_spl_escrow' },
    // { idl: anchorDataStructuresIdl, name: 'anchor_data_structures' },
    // { idl: testCpiIdl, name: 'test_cpi' },
];

// Define the renderers and their corresponding visitors
const renderers = [
    { name: 'js', visitor: renderJavaScriptVisitor },
    { name: 'rust', visitor: renderRustVisitor },
    { name: 'dart', visitor: renderDartVisitor },
];

// Generate clients for each IDL in each language
for (const { idl, name: programName } of idls) {
    const codama = createFromRoot(rootNodeFromAnchor(idl as any));

    for (const { name: lang, visitor } of renderers) {
        const outDir = path.join(BASE_CLIENTS_PATH, lang, 'generated', programName);
        codama.accept(visitor(outDir));
    }
}