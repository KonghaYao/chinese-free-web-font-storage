import { atom, ObjectAtom } from '@cn-ui/reactive';
import { VModel } from '@cn-ui/reactive';
import { addShowCaseRequest } from '../../api/commit';
import { Notice } from '../../Notice';
import { Dialog } from './Dialog';
export const AddShowCase = () => {
    const panelVisible = atom(false);
    const a = ObjectAtom<Parameters<typeof addShowCaseRequest>[0]>({
        showCaseName: '',
        nickName: '',
        detail: '',
        url: '',
    });
    return (
        <>
            <button
                class="cursor-pointer rounded-lg bg-green-700 px-1 text-white"
                onclick={() => panelVisible(true)}
            >
                添加灵感网站
            </button>
            <Dialog
                title="添加灵感网站"
                onSubmit={() => {
                    if (a.showCaseName() && a.nickName() && a.detail() && a.url()) {
                        panelVisible(false);
                        Notice.success('您的请求已记录, 我们将会在一周内处理');
                        addShowCaseRequest(a()).then((res) => {
                            console.log(res);
                        });
                    } else {
                        Notice.error('请填写完整信息');
                    }
                }}
                visible={panelVisible}
            >
                <form action="" class="flex flex-col gap-4 p-4">
                    <input
                        type="text"
                        class="text-input"
                        placeholder="需要添加灵感网站的名称"
                        {...VModel(a.showCaseName)}
                    ></input>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="你的名字"
                        {...VModel(a.nickName)}
                    ></input>
                    <textarea
                        class="text-input"
                        style={{ resize: 'none' }}
                        placeholder="请你描述一下灵感网站"
                        {...VModel(a.detail)}
                    ></textarea>
                    <input
                        type="text"
                        class="text-input"
                        placeholder="提供一个 URL 地址"
                        {...VModel(a.url)}
                    ></input>
                </form>
            </Dialog>
        </>
    );
};
