import { ColoredNumber } from '../../../utils/ColoredNumber';
import { type Result } from '..';

export const StandardAnalyzeTable = (props: { data: Result['standard'] }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>字符标准名称</th>
                    <th>覆盖率 (%)</th>
                    <th>字体占有率 (%)</th>
                </tr>
            </thead>
            <tbody>
                {props.data.map((item, index) => {
                    const percent = parseInt(item.coverage);

                    return (
                        <tr class={ColoredNumber(percent)}>
                            <td>{item.name}</td>
                            <td>
                                {item.coverage} ({item.support_count}/{item.area_count})
                            </td>
                            <td>{item.in_set_rate}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
