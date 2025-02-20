import Layout from '~/layouts/HomeLayout';
import AllFooter from './_index/AllFooter';
import FontList from './_index/FontsList';
import { FriendLinks } from './_index/FriendLinks';
import PerformanceOfTool from './_index/PerformanceOfTool';
import svg from './_index/website_title.svg?raw';
import { languageConfig } from '~/i18n';
import { useLocation, useNavigate } from '@solidjs/router';

export default () => {
    const { lang } = useParams();
    if (!languageConfig.languages.find((i) => i.lang === lang)) {
        const location = useLocation();
        const nav = useNavigate();
        console.log(location.pathname);
        return nav('/zh-cn' + location.pathname);
    }
    return (
        <Layout
            title={$t('049945050aa7435651ba3e2129a14e93')}
            description={$t('62ad0ae253a6017d313347e67f1a0c01')}
            keywords={$t('1abfbf30be4ae4f7805135234c6e81af')}
        >
            <section class="relative overflow-hidden z-10 flex flex-col items-center my-12 ">
                <A
                    href="cdn"
                    class="py-2 px-1 pr-4 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 transition-all dark:text-white hover:bg-gray-200"
                    role="alert"
                >
                    <span class="bg-rose-600 rounded-full text-white px-4 py-1.5 mr-3">
                        {$t('e06fc4f6942fd83dd96552f7a4ee101d')}
                    </span>
                    <span class="font-medium">
                        {$t('d0e0ce4d3fccf0e1ad8933907b4d6e81')}
                        {'>'}
                    </span>
                </A>

                <h2
                    class="home-title xs:text-[8vh] whitespace-nowrap text-[6vh] leading-[1.1em] sm:text-[11vw] lg:text-[17vh] hidden"
                    style="letter-spacing: 0.5rem;"
                >
                    {/*  @i18n-ignore  */}
                    中文网字计划
                </h2>
                <div innerHTML={svg}></div>

                <div class="pt-12 text-2xl font-thin italic leading-[3em] text-gray-600 sm:text-3xl">
                    {/*  @i18n-ignore  */}
                    The Chinese Web Fonts Plan
                </div>

                <h3 class="huge-letter-space max-w-[30em] px-4 mt-12  font-thin text-gray-500 sm:max-w-[30em] lg:max-w-none lg:text-2xl">
                    {$t('1214315c84ace8d1b83c5fdadbf8495a')}
                </h3>
                <div class="flex gap-4 mt-8 border rounded-lg ring-rose-600 py-4 px-6">
                    <A href="cdn">
                        <button class="huge-letter-space transition-colors px-2 py-1 rounded-md text-gray-500  hover:text-gray-700 ">
                            {$t('740702fdd79e9aaa5ee8e491a1aa5d9c')}
                        </button>
                    </A>
                    <A href="article">
                        <button class="huge-letter-space transition-colors px-2 py-1 rounded-md text-gray-500  hover:text-gray-700 ">
                            {$t('e08752d7ba2a6fe8a069d84e88f04cad')}
                        </button>
                    </A>
                    <A href="online-split">
                        <button class="huge-letter-space transition-colors px-2 py-1 rounded-md text-gray-500  hover:text-gray-700 ">
                            {$t('711eae53dabedaceedcdb1e5a3d0daa1')}
                        </button>
                    </A>
                    <A
                        href="https://github.com/KonghaYao/chinese-free-web-font-storage"
                        target="_blank"
                    >
                        <button class="huge-letter-space transition-colors px-2 py-1 rounded-md  text-gray-500  hover:text-gray-700 ">
                            {$t('d1d57cd7aace1887ff4fff86bac21096')}
                        </button>
                    </A>
                    <A href="#font-list">
                        <button class="huge-letter-space transition-colors px-2 py-1 rounded-md bg-rose-50 text-rose-600 hover:text-rose-600 hover:bg-rose-100 ">
                            {$t('03f38cc52663018783a287cf072db12a')}
                        </button>
                    </A>
                </div>
                <aside aria-hidden class="pointer-events-none  text-gray-300/20 ">
                    <div class="absolute top-52 -left-16 " style="font-size:50vh">
                        {/*   @i18n-ignore   */}江
                    </div>
                    <div class="absolute top-36 -right-24" style="font-size:30vh">
                        {/*   @i18n-ignore   */}夏
                    </div>
                    <div class="absolute -top-16 left-8" style="font-size:25vh">
                        {/*   @i18n-ignore   */}尧
                    </div>
                </aside>
            </section>

            <FontList />
            <div
                class="text-center text-6xl py-48  bg-line translate-y-24"
                style={{
                    'letter-spacing': '2rem',
                }}
            >
                {$t('6823387557f44cb9b26695fb1933dabe')}
            </div>
            <PerformanceOfTool />
            <FriendLinks />
            <AllFooter />
        </Layout>
    );
};
