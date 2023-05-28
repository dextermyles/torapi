"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTorrentApi = void 0;
const chalk_1 = __importDefault(require("chalk"));
const torrent_search_api_1 = __importDefault(require("torrent-search-api"));
const search_result_1 = require("../models/search-result");
function searchTorrentApi(keyword) {
    torrent_search_api_1.default.enablePublicProviders();
    let search = torrent_search_api_1.default.search(['ThePirateBay'], keyword, 'Video', 10);
    return search.then((results) => {
        let torrents = results.map((t) => {
            let torr = new search_result_1.SearchResult(t.title, t.magnet, t.size, t.peers, t.seeds);
            return torr;
        });
        console.log(chalk_1.default.green('*** Search Results ***'));
        console.dir(torrents);
        return torrents;
    }, (err) => {
        console.log(chalk_1.default.red(err));
    });
}
exports.searchTorrentApi = searchTorrentApi;
//# sourceMappingURL=search.js.map