import { ArgsStoryFn, RenderContext } from 'storybook/internal/types';
import { W as WebComponentsRenderer } from './types-9976a2c9.js';
import 'lit';

declare const render: ArgsStoryFn<WebComponentsRenderer>;
declare function renderToCanvas({ storyFn, kind, name, showMain, showError, forceRemount }: RenderContext<WebComponentsRenderer>, canvasElement: WebComponentsRenderer['canvasElement']): void;

declare const parameters: {};

export { parameters, render, renderToCanvas };
