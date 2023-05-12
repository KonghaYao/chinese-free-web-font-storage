import { SearchBox } from './SearchBox';

export const SearchPage = (props: { info: Record<string, string> }) => {
    return (
        <div class="flex h-screen w-screen flex-col items-center p-4">
            <SearchBox info={props.info}></SearchBox>
        </div>
    );
};
