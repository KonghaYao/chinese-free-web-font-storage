import { getFileListIndex } from '~/api/fontListIndex';

export const getFontList = async () => {
    'use server';
    return getFileListIndex();
};
