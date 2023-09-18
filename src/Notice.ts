import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte
import { isServer } from 'solid-js/web';
export const Notice = isServer ? {} as Notyf : new Notyf();
