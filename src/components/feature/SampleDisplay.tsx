import { atom } from '@cn-ui/reactive';

export const SampleDisplay = (props: {
    title: string;
    tag: string;
    fullTag: string;
    desc: string;
    sample: string;
    style?: string;
}) => {
    const featureTrigger = atom(true);
    return (
        <section>
            <h3 class="py-4 text-2xl text-green-600" id={props.tag}>
                <span class="" title={props.fullTag}>
                    {props.tag}
                </span>
                <span> {props.title}</span>
                <span
                    class="text-md float-right cursor-pointer select-none rounded-md bg-green-600 p-1 text-white"
                    onclick={() => featureTrigger((i) => !i)}
                >
                    {featureTrigger() ? 'on' : 'off'}
                </span>
            </h3>
            <h4 class="py-2 text-xs text-gray-600">{props.desc}</h4>
            <div
                class="rounded-xl  bg-white p-4 text-lg"
                style={
                    `font-feature-settings:'${props.tag}' ${featureTrigger() ? 'on' : 'off'};` +
                    (props.style ?? '')
                }
            >
                {props.sample}
            </div>
        </section>
    );
};
