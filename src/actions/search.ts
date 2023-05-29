import chalk from 'chalk';
import TorrentSearchApi from 'torrent-search-api';
import { SearchResult } from '../models/search-result';
import { Torrent } from '../models/torrent';

export function searchTorrentApi(keyword: string): Promise<void> {
    TorrentSearchApi.enablePublicProviders();
    
    const search = TorrentSearchApi.search(['ThePirateBay'], keyword, 'Video', 10);
    
    const promise = new Promise<SearchResult[]>((resolve, reject) => {
        search.then((results) => {
            const torrents = results as Torrent[];
            const searchResults = torrents.map((t) => {
                const torr = new SearchResult(t.title, t.magnet, t.size, t.peers, t.seeds);
                return torr;
            }).filter(x => x.seeds && x.seeds > 0);
            resolve(searchResults);
        }, (err) => {
            console.log(chalk.red(err));
            reject(err);
        });
    });

    return promise
        .then((results) => {
            console.log(chalk.green('*** Search Results ***'));
            console.dir(results);
        });
}