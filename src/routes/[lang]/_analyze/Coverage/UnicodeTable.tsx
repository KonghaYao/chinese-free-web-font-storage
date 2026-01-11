import { createSignal } from 'solid-js';
import { ColoredNumber } from '~/utils/ColoredNumber';
import { type Result } from '..';
import { $t } from '~/i18n';

export const UnicodeTable = (props: { data: Result['unicode'] }) => {
    const [data, setData] = createSignal(props.data, { equals: false });
    const [ignoreUnder, setIgnoreUnder] = createSignal(0);
    return (
        <>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked
                        oninput={(e) => {
                            setIgnoreUnder(() => {
                                const isChecked = (e.target as any).checked;
                                return isChecked ? 0 : -1;
                            });
                        }}
                    ></input>
                    {$t('1f9a08ca1499a450a35c48d669498104')}
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th
                            onclick={() => {
                                setData(() =>
                                    props.data.sort((a, b) => {
                                        return a.start! - b.start!;
                                    })
                                );
                            }}
                        >
                            {$t('f121a7f53dd45bf3d2ddc64f2dfea381')}
                        </th>
                        <th>{$t('d3ce40d862f1c7e4748e6c28ffb0a007')}</th>

                        <th
                            onclick={() => {
                                setData(() =>
                                    props.data.sort((a, b) => {
                                        return b.support_count - a.support_count;
                                    })
                                );
                            }}
                        >
                            {$t('e16f8c41b6c11feaefcb20d8a711ce7f')}
                        </th>
                        <th
                            onclick={() => {
                                setData(() =>
                                    props.data.sort((a, b) => {
                                        return parseFloat(b.coverage) - parseFloat(a.coverage);
                                    })
                                );
                            }}
                        >
                            {$t('caf8b0b2cc1952bf60cbae20dbdef221')}
                        </th>
                        <th>{$t('dd433a8e879202f8bb74aa962c230082')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data().map((item, index) => {
                        if (item.support_count <= ignoreUnder()) return <></>;
                        return (
                            <tr class={ColoredNumber(parseInt(item.coverage))}>
                                <td>
                                    <ul>
                                        <li class="text-xs">{item.name}</li>
                                        <li>{item.cn}</li>
                                    </ul>
                                </td>
                                <td>
                                    <span>
                                        {item.start!.toString(16).toUpperCase().padStart(4, '0')}
                                    </span>{' '}
                                    -
                                    <span>
                                        {item.end!.toString(16).toUpperCase().padStart(4, '0')}
                                    </span>
                                </td>
                                <td>
                                    {item.support_count}/{item.area_count}
                                </td>
                                <td>{item.coverage}</td>
                                <td>{item.in_set_rate}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};
