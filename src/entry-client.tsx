// @refresh reload
import './polyfill';
import { mount, StartClient } from '@solidjs/start/client';
export default mount(() => <StartClient />, document.getElementById('app')!);
