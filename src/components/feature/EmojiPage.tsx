import { resource } from '@cn-ui/reactive';
import './emoji.css';
export const EmojiPage = () => {
    const data = resource<
        {
            group: string;
            emoji: {
                base: number[];
                alternates: number[];
                emoticons: string[];
                shortcodes: string[];
                animated: boolean;
            }[];
        }[]
    >(
        () => {
            return fetch(
                'https://jsdelivr.deno.dev/gh/googlefonts/emoji-metadata@main/emoji_15_1_ordering.json'
            ).then((res) => {
                return res.json();
            });
        },
        {
            initValue: [],
        }
    );
    return (
        <section>
            {data().map((i) => {
                return (
                    <section>
                        <h2>{i.group}</h2>
                        <ul>
                            {i.emoji.map((i) => {
                                return (
                                    <li class="noto-color-emoji inline">
                                        {i.base.map((i) => String.fromCodePoint(i)).join('')}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </section>
    );
};
