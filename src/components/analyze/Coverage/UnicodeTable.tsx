import { createSignal } from 'solid-js';
import { ColoredNumber } from '../../../utils/ColoredNumber';
import { type Result } from '..';

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
                    忽略空覆盖率
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
                            名称
                        </th>
                        <th>区域</th>

                        <th
                            onclick={() => {
                                setData(() =>
                                    props.data.sort((a, b) => {
                                        return b.support_count - a.support_count;
                                    })
                                );
                            }}
                        >
                            字符个数
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
                            覆盖率 (%)
                        </th>
                        <th>字体占有率 (%)</th>
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
