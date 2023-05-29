import chalk from 'chalk';
import * as fs from 'fs';
import _ from 'lodash';
import torrentStream from 'torrent-stream';
import { DateTime } from 'ts-luxon';

export function download(magnet: string, path?: string | undefined): Promise<void> {
    if (!path)
        path = 'movies';

    path = `C:\\media\\${path}\\`;

    const options: TorrentStream.TorrentEngineOptions = {
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

    console.log(chalk.blue(`DOWNLOAD PATH: ${path}`));

    let totalLengthBytes = 0;
    let completed = 0;
    const engine = torrentStream(magnet, options);
    const promise = new Promise<boolean>((resolve, reject) => {
        try {
            engine.listen(6881, () => {
                console.log(chalk.green('Listening on port 6881'));
            });

            engine.on('torrent', () => {
                console.log(chalk.green('** Metadata has been fetched **'));
            });

            engine.on('ready', () => {
                engine.files.forEach(function (file) {
                    console.log(chalk.magentaBright('downloading filename:', file.name));
                    file.select();
                });

                totalLengthBytes = engine.files.reduce(function (prevLength, currFile) {
                    return prevLength + currFile.length;
                }, 0);
            });

            let lastDate = DateTime.now();
            let lastDownloaded = 0;
            const history: number[] = [];

            engine.on('download', () => {
                const downloadedAt = DateTime.now();
                const downloaded = engine.swarm.downloaded;
                const bytesRemaining = totalLengthBytes - downloaded;

                completed = ((engine.swarm.downloaded / totalLengthBytes) * 100.0);

                const diff = downloaded - lastDownloaded;
                const timeDiff = downloadedAt.diff(lastDate, 'milliseconds')
                    .milliseconds;

                const msDiff = (1000.0 / timeDiff);
                const bytesPerSec = (diff * msDiff);

                history.push(bytesPerSec);

                if (history.length > 10)
                    history.splice(0, 1);

                let averageBytesPerSec = (_.sum(history) / history.length);
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

                console.log(chalk.cyanBright(`${completed.toFixed(1)}% | ${speed} | ${timeleft} remaining`));

                if (completed >= 100) {
                    console.log(chalk.green("DOWNLOAD COMPLETE!"));

                    engine.destroy(() => {
                        resolve(true);
                    });
                }

                lastDownloaded = downloaded;
                lastDate = downloadedAt;
            });

            engine.on('idle', () => {
                console.log(chalk.green("IDLING..."));
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
            console.log(chalk.green("SHUTTING DOWN"));
        });
}