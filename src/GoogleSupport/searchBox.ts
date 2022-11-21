import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';
import 'instantsearch.css/themes/reset-min.css';
const searchClient = algoliasearch('WNATE69PVR', '8b36fe56fca654afaeab5e6f822c14bd');
const search = instantsearch({
    indexName: 'prod_FONTS',
    searchClient,
});

search.addWidgets([
    searchBox({
        container: '#searchbox',
    }),

    hits({
        container: '#hits',
    }),
]);

search.start();
