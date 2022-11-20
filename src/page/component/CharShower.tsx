import { Component } from 'solid-js';
import { VirtualContainer } from '@minht11/solid-virtual-container';

export const CharShower: Component<{ list: string[]; class: string }> = (props) => {
    let scrollTargetElement;
    return (
        <>
            <div
                class={
                    'mx-4 flex h-40 overflow-auto rounded-md bg-gray-300  p-8 md:h-80 ' +
                    props.class
                }
                ref={scrollTargetElement}
            >
                <VirtualContainer
                    items={props.list}
                    scrollTarget={scrollTargetElement}
                    itemSize={{ height: 50, width: 50 }}
                    crossAxisCount={(measurements) => {
                        return Math.floor(
                            measurements.container.cross / measurements.itemSize.cross
                        );
                    }}
                >
                    {(item) => {
                        return (
                            <div style={item.style} tabIndex={item.tabIndex} role="listitem">
                                <SingChar item={item.item}></SingChar>;
                            </div>
                        );
                    }}
                </VirtualContainer>
            </div>
        </>
    );
};
const SingChar: Component<{ item: string }> = (props) => {
    return (
        <div class="flex h-[50px] w-[50px] flex-col justify-center ">
            <span class="text-lg">{props.item}</span>
            <span class="font-sans text-xs font-thin">
                U+{props.item.charCodeAt(0).toString(16)}
            </span>
        </div>
    );
};
