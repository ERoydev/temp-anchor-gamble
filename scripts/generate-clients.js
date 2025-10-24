"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codama_1 = require("codama");
const nodes_from_anchor_1 = require("@codama/nodes-from-anchor");
const renderers_js_1 = __importDefault(require("@codama/renderers-js"));
const renderers_dart_1 = __importDefault(require("@codama/renderers-dart"));
const renderers_rust_1 = __importDefault(require("@codama/renderers-rust"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const anchorGambleIdl = JSON.parse(fs_1.default.readFileSync('target/idl/anchor_gamble.json', 'utf8'));
const anchorCounterIdl = JSON.parse(fs_1.default.readFileSync('target/idl/counter.json', 'utf8'));
const anchorSplEscrowIdl = JSON.parse(fs_1.default.readFileSync('target/idl/spl_escrow.json', 'utf8'));
const anchorDataStructuresIdl = JSON.parse(fs_1.default.readFileSync('target/idl/data_structures.json', 'utf8'));
const BASE_CLIENTS_PATH = 'clients';
const idls = [
    { idl: anchorGambleIdl, name: 'anchor_gamble' },
    { idl: anchorCounterIdl, name: 'anchor_counter' },
    { idl: anchorSplEscrowIdl, name: 'anchor_spl_escrow' },
    { idl: anchorDataStructuresIdl, name: 'anchor_data_structures' },
];
const renderers = [
    { name: 'js', visitor: renderers_js_1.default },
    { name: 'rust', visitor: renderers_rust_1.default },
    { name: 'dart', visitor: renderers_dart_1.default },
];
for (const { idl, name: programName } of idls) {
    const codama = (0, codama_1.createFromRoot)((0, nodes_from_anchor_1.rootNodeFromAnchor)(idl));
    for (const { name: lang, visitor } of renderers) {
        const outDir = path_1.default.join(BASE_CLIENTS_PATH, lang, 'generated', programName);
        codama.accept(visitor(outDir));
    }
}
