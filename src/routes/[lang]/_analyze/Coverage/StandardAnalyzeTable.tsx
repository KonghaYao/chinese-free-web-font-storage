import { ColoredNumber } from '~/utils/ColoredNumber';
import { type Result } from '..';
import { $t } from '~/i18n';

export const StandardAnalyzeTable = (props: { data: Result['standard'] }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>{$t('70aae6cb03fe10aa8fd41f869a323a94')}</th>
                    <th>{$t('c6cd9aa65ceab264484e67885193d243')}</th>
                    <th>{$t('dd433a8e879202f8bb74aa962c230082')}</th>
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
