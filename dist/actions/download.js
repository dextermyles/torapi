"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const torrent_stream_1 = __importDefault(require("torrent-stream"));
const ts_luxon_1 = require("ts-luxon");
function download(magnet, path) {
    if (!path)
        path = 'movies';
    path = `C:\\media\\${path}\\`;
    const options = {
        connections: 200,
        uploads: 10,
        tmp: 'C:\\tmp',
        path,
        verify: true,
        dht: true,
        tracker: true,
        trackers: ["udp://tracker.coppersurfer.tk:6969/announce",
            "udp://9.rarbg.to:2920/announce",
            "udp://tracker.opentrackr.org:1337",
            "udp://tracker.internetwarriors.net:1337/announce",
            "udp://tracker.leechers-paradise.org:6969/announce",
            "udp://tracker.pirateparty.gr:6969/announce",
            "udp://tracker.cyberia.is:6969/announce"]
    };
    const exists = fs.existsSync(path);
    if (!exists) {
        fs.mkdirSync(path);
    }
    console.log(chalk_1.default.blue(`DOWNLOAD PATH: ${path}`));
    let totalLengthBytes = 0;
    let completed = 0;
    const engine = (0, torrent_stream_1.default)(magnet, options);
    const promise = new Promise((resolve, reject) => {
        try {
            engine.listen(6881, () => {
                console.log(chalk_1.default.green('Listening on port 6881'));
            });
            engine.on('torrent', () => {
                console.log(chalk_1.default.green('** Metadata has been fetched **'));
                console.log(engine.files.map(x => { x.name + `[${((x.length / 1024) / 1024)} mb]`; }));
            });
            engine.on('ready', () => {
                engine.files.forEach(function (file) {
                    console.log(chalk_1.default.magentaBright('downloading filename:', file.name));
                    file.select();
                });
                totalLengthBytes = engine.files.reduce(function (prevLength, currFile) {
                    return prevLength + currFile.length;
                }, 0);
            });
            let lastDate = ts_luxon_1.DateTime.now();
            let lastDownloaded = 0;
            const history = [];
            engine.on('download', () => {
                const downloadedAt = ts_luxon_1.DateTime.now();
                const downloaded = engine.swarm.downloaded;
                const bytesRemaining = totalLengthBytes - downloaded;
                completed = Math.round((engine.swarm.downloaded / totalLengthBytes) * 100.0);
                const diff = downloaded - lastDownloaded;
                const timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                    .milliseconds;
                const msDiff = (1000.0 / timeDiff);
                const bytesPerSec = (diff * msDiff);
                history.push(bytesPerSec);
                if (history.length > 10)
                    history.splice(0, 1);
                let averageBytesPerSec = (lodash_1.default.sum(history) / history.length);
                if (completed > 95)
                    averageBytesPerSec = bytesPerSec;
                const kbytes = (averageBytesPerSec / 1024);
                const mbytes = (kbytes / 1024).toFixed(2);
                const etaSeconds = (bytesRemaining / averageBytesPerSec);
                const etaMins = (etaSeconds / 60);
                const etaHours = (etaMins / 60);
                let timeleft = `${etaHours.toFixed(2)} hours`;
                if (etaHours < 1)
                    timeleft = `${etaMins.toFixed(2)} minutes`;
                if (etaMins < 1)
                    timeleft = `${etaSeconds.toFixed(2)} minutes`;
                const speed = `${mbytes} mb/s`;
                console.log(chalk_1.default.cyanBright(`${completed}% | ${speed} | ${timeleft} remaining`));
                if (completed >= 100) {
                    console.log(chalk_1.default.green("DOWNLOAD COMPLETE!"));
                    engine.destroy(() => {
                        resolve(true);
                    });
                }
                lastDownloaded = downloaded;
                lastDate = downloadedAt;
            });
            engine.on('idle', () => {
                console.log(chalk_1.default.green("IDLING..."));
                engine.destroy(() => {
                    resolve(true);
                });
            });
        }
        catch (e) {
            reject('Error: ' + e);
        }
    });
    return promise
        .then(() => {
        console.log(chalk_1.default.green("SHUTTING DOWN"));
    });
}
exports.download = download;
//# sourceMappingURL=download.js.map