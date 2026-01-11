import { URLLinkHelp } from '~/configs';
import { $t } from '~/i18n';
export default () => {
    return (
        <footer class="flex flex-col w-full bg-black text-white gap-8">
            <div></div>
            <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 w-full text-sm px-4 md:px-24 py-12">
                <div>
                    <header class="text-lg">{$t('ed83702637c2943b109e8bcf2ba2d2fa')}</header>
                    <ul>
                        {[...Object.values(URLLinkHelp)].map((item) => {
                            return (
                                <li>
                                    <a href={item.url}>🎊 {item.desc}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div>
                    <header class="text-lg">{$t('119f31338eb778e7c73eec27765e140f')}</header>
                    <ul>
                        <li>
                            <a href="https://github.com/konghayao" target="_blank">
                                {' '}
                                Github
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex justify-between text-xs text-neutral-300 border-t border-neutral-600 p-4">
                <div>
                    <a href="https://www.netlify.com/" class="text-green-400">
                        {$t('afda6c18c0f69b5a4e63f915c7ecdad2')}
                    </a>
                </div>
                <div>{$t('f93f005ee60820b7ce63cb2c52b15e66')}</div>
            </div>
        </footer>
    );
};
