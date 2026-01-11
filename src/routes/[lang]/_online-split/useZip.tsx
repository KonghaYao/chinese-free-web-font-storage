import save from 'file-saver';
const { saveAs } = save;
import { resource, type Atom } from '@cn-ui/reactive';
import { Notice } from '~/Notice';
import { $t } from '~/i18n';

/** 压缩文件 */
export function useZip(
    getFileName: () => string,
    resultList: Atom<{ name: string; buffer: Uint8Array }[]>
) {
    return resource(
        async () => {
            const name = getFileName();
            const { default: JSZip } = await import('jszip');
            const zip = new JSZip();
            const folder = zip.folder(name)!;
            resultList().forEach((i) => {
                folder.file(i.name, i.buffer);
            });

            return zip.generateAsync({ type: 'blob' }).then(function (content: Blob) {
                Notice.success($t('ebb8008060a34442e4752ddba60dfc49'));
                saveAs(content, name + '.zip');
            });
        },
        {
            immediately: false,
            onError: (e) => {
                Notice.error(e);
            },
        }
    );
}
