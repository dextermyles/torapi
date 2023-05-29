#! /usr/bin/env node
import { Command } from 'commander';
import { download } from './actions/download';
import { searchTorrentApi } from './actions/search';

//add the following line
const program = new Command();

program.command('search')
    .argument('keyword', 'search keyword')
    .action((keyword) => searchTorrentApi(keyword));

program.command('download')
    .argument('magnet', 'magnet link')
    .argument('path', 'c:/media/<path>')
    .action(function(magnet: string, path: string) { 
        return download(magnet, path);
    });

program.parse();