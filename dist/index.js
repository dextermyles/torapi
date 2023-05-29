#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const download_1 = require("./actions/download");
const search_1 = require("./actions/search");
//add the following line
const program = new commander_1.Command();
program.command('search')
    .argument('keyword', 'search keyword')
    .action((keyword) => (0, search_1.searchTorrentApi)(keyword));
program.command('download')
    .argument('magnet', 'magnet link')
    .argument('path', 'c:/media/<path>')
    .action(function (magnet, path) {
    return (0, download_1.download)(magnet, path);
});
program.parse();
//# sourceMappingURL=index.js.map