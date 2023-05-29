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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    return __awaiter(this, void 0, void 0, function* () {
        if (!path)
            path = 'movies';
        path = `C:\\media\\${path}\\`;
        /** @type {*} */
        let options = {
            connections: 200,
            uploads: 10,
            tmp: 'C:\\tmp',
            path,
            verify: true,
            dht: true,
            tracker: true,
            trackers: [
                "udp://public.popcorn-tracker.org:6969/announce",
                "http://104.28.1.30:8080/announce",
                "http://104.28.16.69/announce",
                "http://107.150.14.110:6969/announce",
                "http://109.121.134.121:1337/announce",
                "http://114.55.113.60:6969/announce",
                "http://125.227.35.196:6969/announce",
                "http://128.199.70.66:5944/announce",
                "http://157.7.202.64:8080/announce",
                "http://158.69.146.212:7777/announce",
                "http://173.254.204.71:1096/announce",
                "http://178.175.143.27/announce"
            ]
        };
        var exists = fs.existsSync(path);
        if (!exists) {
            fs.mkdirSync(path);
        }
        console.log(chalk_1.default.blue(`DOWNLOAD PATH: ${path}`));
        var totalLengthBytes = 0;
        var totalFiles = 0;
        var completed = 0;
        var engine = (0, torrent_stream_1.default)(magnet, options);
        var promise = new Promise((resolve, reject) => {
            try {
                engine.on('ready', () => {
                    console.log(chalk_1.default.bold.magenta("Found " + Object.keys(engine.files).length + " files:"));
                    engine.files.forEach(function (file) {
                        totalFiles += 1;
                        console.log("------------------\n");
                        console.log('filename:', file.name);
                        file.select();
                        console.log("------------------\n");
                    });
                    totalLengthBytes = engine.files.reduce(function (prevLength, currFile) {
                        return prevLength + currFile.length;
                    }, 0);
                });
                var lastDate = ts_luxon_1.DateTime.now();
                var lastDownloaded = 0;
                var lastBytesPerSec = 0;
                var history = [];
                engine.on('download', (pieceIndex) => {
                    var downloadedAt = ts_luxon_1.DateTime.now();
                    var downloaded = engine.swarm.downloaded;
                    var bytesRemaining = totalLengthBytes - downloaded;
                    completed = Math.round((engine.swarm.downloaded / totalLengthBytes) * 100.0);
                    var diff = downloaded - lastDownloaded;
                    var timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                        .milliseconds;
                    var msDiff = (1000.0 / timeDiff);
                    var bytesPerSec = (diff * msDiff);
                    history.push(bytesPerSec);
                    if (history.length > 10)
                        history.splice(0, 1);
                    var averageBytesPerSec = (lodash_1.default.sum(history) / history.length);
                    if (completed > 95)
                        averageBytesPerSec = bytesPerSec;
                    var kbytes = (averageBytesPerSec / 1024);
                    var mbytes = (kbytes / 1024).toFixed(2);
                    var etaSeconds = (bytesRemaining / averageBytesPerSec);
                    var etaMins = (etaSeconds / 60);
                    var etaHours = (etaMins / 60);
                    var timeleft = `${etaHours.toFixed(2)} hours`;
                    if (etaHours < 1)
                        timeleft = `${etaMins.toFixed(2)} minutes`;
                    if (etaMins < 1)
                        timeleft = `${etaSeconds.toFixed(2)} minutes`;
                    var speed = `${mbytes} mb/s`;
                    console.log(chalk_1.default.cyanBright(`${completed}% | ${speed} | ${timeleft} remaining`));
                    if (completed >= 100) {
                        console.log(chalk_1.default.green("DOWNLOAD COMPLETE!"));
                        engine.destroy(() => {
                            console.log(chalk_1.default.green("SHUTTING DOWN"));
                            resolve(true);
                        });
                    }
                    lastDownloaded = downloaded;
                    lastDate = downloadedAt;
                });
                engine.on('idle', () => {
                    console.log(chalk_1.default.green("IDLING..."));
                    engine.destroy(() => {
                        console.log(chalk_1.default.green("SHUTTING DOWN"));
                        resolve(true);
                    });
                });
            }
            catch (e) {
                reject('Error: ' + e);
            }
        });
        return promise;
    });
}
exports.download = download;
//# sourceMappingURL=download.js.map