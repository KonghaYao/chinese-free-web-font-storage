export const ColoredNumber = (percent: number) => {
    return percent >= 80
        ? 'text-green-700'
        : percent >= 60
        ? 'text-yellow-700'
        : percent >= 40
        ? 'text-blue-700'
        : percent >= 20
        ? 'text-purple-700'
        : 'text-rose-700';
};
