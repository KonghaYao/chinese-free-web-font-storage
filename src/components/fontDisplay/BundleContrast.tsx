import prettyBytes from 'pretty-bytes';
import { AsyncReporterLoader } from './AsyncReporterLoader';

/** 展示打包数据的信息 */
export const BundleContrast = AsyncReporterLoader((props) => {
    const bundleMessage = props.reporter.bundleMessage;
    const env = props.reporter.env;
    return (
        <div class="rounded-lg bg-white p-4 ">
            <h2 class="pb-4 text-lg">原始信息</h2>
            <ul class="select-text text-gray-600">
                <li>
                    原始文件大小
                    <span class="float-right">{prettyBytes(bundleMessage.originLength)}</span>
                </li>
                <li>
                    TTF状态文件大小
                    <span class="float-right">{prettyBytes(bundleMessage.ttfLength)}</span>
                </li>
                <li>
                    打包后总大小
                    <span class="float-right text-green-600">
                        {prettyBytes(bundleMessage.bundledTotalLength)} 「
                        {(
                            (bundleMessage.bundledTotalLength * 100) /
                            bundleMessage.originLength
                        ).toFixed(2)}
                        %」
                    </span>
                </li>
                {'os' in env && (
                    <>
                        <li class="text-green-600">
                            设备信息
                            {[
                                env.os.version,
                                env.device.architecture,
                                env.device.cpus,
                                '核心CPU',
                            ].join(' ')}
                        </li>
                        <li>
                            {[env.envName, env.runtime.version].join(' ')}
                            <span class="float-right">
                                {ShowTimeFormat(new Date(env.createdTime))}
                            </span>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
});
export const ShowTimeFormat = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
