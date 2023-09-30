import { ensureFontMessageString } from '../../../utils/ensureFontMessageString';

export function StringObjectToTable(props: { data: Record<string, string> }) {
    const { data } = props;

    // 将数据对象转换为二维数组，方便生成表格
    const rows = Object.entries(data);

    return (
        <table>
            <tbody>
                {rows.map((row, index) => (
                    <tr>
                        <td>{ensureFontMessageString(row[0])}</td>
                        <td>{ensureFontMessageString(row[1])}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
