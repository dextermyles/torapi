"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTorrentApi = void 0;
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = __importDefault(require("lodash"));
const torrent_search_api_1 = __importDefault(require("torrent-search-api"));
const search_result_1 = require("../models/search-result");
function searchTorrentApi(keyword) {
    torrent_search_api_1.default.enablePublicProviders();
    const search = torrent_search_api_1.default.search(['ThePirateBay'], keyword, 'Video', 10);
    let trackers = [];
    const promise = new Promise((resolve, reject) => {
        search.then((results) => {
            const torrents = results;
            const searchResults = torrents.map((t) => {
                let trackersArr = t.magnet.split('&tr=');
                if (trackersArr.length > 0) {
                    trackersArr.forEach((element, i) => {
                        if (i > 0) {
                            let test = decodeURIComponent(element);
                            let uri = decodeURI(element);
                            trackers.push(test);
                        }
                    });
                }
                trackers = lodash_1.default.uniq(trackers);
                const torr = new search_result_1.SearchResult(t.title, t.magnet, t.size, t.peers, t.seeds);
                return torr;
            }).filter(x => x.seeds && x.seeds > 0);
            console.dir(trackers);
            resolve(searchResults);
        }, (err) => {
            console.log(chalk_1.default.red(err));
            reject(err);
        });
    });
    return promise
        .then((results) => {
        console.log(chalk_1.default.green('*** Search Results ***'));
        console.dir(results);
    });
}
exports.searchTorrentApi = searchTorrentApi;
//# sourceMappingURL=search.js.map