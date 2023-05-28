import chalk from 'chalk';
import TorrentSearchApi from 'torrent-search-api';
import { SearchResult } from '../models/search-result';

export function searchTorrentApi(keyword: string) {
    TorrentSearchApi.enablePublicProviders();
    let search = TorrentSearchApi.search(['ThePirateBay'], keyword, 'Video', 10);
    return search.then((results: any) => {
        let torrents = results.map((t: any) => {
            let torr = new SearchResult(t.title, t.magnet, t.size, t.peers, t.seeds);
            return torr;
        })

        console.log(chalk.green('*** Search Results ***'));
        console.dir(torrents);
        return torrents;
    }, (err) => {
        console.log(chalk.red(err));
    });
}