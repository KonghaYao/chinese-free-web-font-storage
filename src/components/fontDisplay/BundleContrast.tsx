import prettyBytes from 'pretty-bytes';
import { AsyncReporterLoader } from './AsyncReporterLoader';
import { Show } from 'solid-js/web';

export const BundleContrast = AsyncReporterLoader((props) => {
    const bundleMessage = props.reporter.bundleMessage;
    const env = props.reporter.env;
    return (
        <div class="rounded-lg bg-white p-4 ">
            <h2 class="pb-4 text-lg">打包信息</h2>
            <ul class="text-gray-600">
                <li>原始文件大小 {prettyBytes(bundleMessage.originLength)}</li>
                <li>TTF状态文件大小 {prettyBytes(bundleMessage.ttfLength)}</li>
                <li>
                    打包后总大小 {prettyBytes(bundleMessage.bundledTotalLength)} 「
                    {(
                        (bundleMessage.bundledTotalLength * 100) /
                        bundleMessage.originLength
                    ).toFixed(2)}
                    %」
                </li>
                {'os' in env && (
                    <>
                        <li>
                            {[
                                env.os.version,
                                env.device.architecture,
                                env.device.cpus,
                                '核心CPU',
                            ].join(' ')}
                        </li>
                        <li>{[env.envName, env.runtime.version].join(' ')}</li>
                        <li>{ShowTimeFormat(new Date(env.createdTime))}</li>
                    </>
                )}
            </ul>
        </div>
    );
});
export const ShowTimeFormat = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
