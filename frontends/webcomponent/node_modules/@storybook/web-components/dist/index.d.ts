import { Args, ComponentAnnotations, AnnotatedStoryFn, StoryAnnotations, StrictArgs, DecoratorFunction, LoaderFunction, StoryContext as StoryContext$1, ProjectAnnotations, NamedOrDefaultProjectAnnotations, NormalizedProjectAnnotations } from 'storybook/internal/types';
export { ArgTypes, Args, Parameters, StrictArgs } from 'storybook/internal/types';
import { W as WebComponentsRenderer } from './types-9976a2c9.js';
import 'lit';

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/api/csf#default-export)
 */
type Meta<TArgs = Args> = ComponentAnnotations<WebComponentsRenderer, TArgs>;
/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/api/csf#named-story-exports)
 */
type StoryFn<TArgs = Args> = AnnotatedStoryFn<WebComponentsRenderer, TArgs>;
/**
 * Story object that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/api/csf#named-story-exports)
 */
type StoryObj<TArgs = Args> = StoryAnnotations<WebComponentsRenderer, TArgs>;
type Decorator<TArgs = StrictArgs> = DecoratorFunction<WebComponentsRenderer, TArgs>;
type Loader<TArgs = StrictArgs> = LoaderFunction<WebComponentsRenderer, TArgs>;
type StoryContext<TArgs = StrictArgs> = StoryContext$1<WebComponentsRenderer, TArgs>;
type Preview = ProjectAnnotations<WebComponentsRenderer>;

declare function isValidComponent(tagName: string): boolean;
declare function isValidMetaData(customElements: any): boolean;
/** @param customElements `any` for now as spec is not super stable yet */
declare function setCustomElements(customElements: any): void;
declare function setCustomElementsManifest(customElements: any): void;
declare function getCustomElements(): any;

/**
 * Function that sets the globalConfig of your storybook. The global config is the preview module of
 * your .storybook folder.
 *
 * It should be run a single time, so that your global config (e.g. decorators) is applied to your
 * stories when using `composeStories` or `composeStory`.
 *
 * Example:
 *
 * ```jsx
 * // setup-file.js
 * import { setProjectAnnotations } from '@storybook/web-components';
 * import projectAnnotations from './.storybook/preview';
 *
 * setProjectAnnotations(projectAnnotations);
 * ```
 *
 * @param projectAnnotations - E.g. (import projectAnnotations from '../.storybook/preview')
 */
declare function setProjectAnnotations(projectAnnotations: NamedOrDefaultProjectAnnotations<any> | NamedOrDefaultProjectAnnotations<any>[]): NormalizedProjectAnnotations<WebComponentsRenderer>;

export { Decorator, Loader, Meta, Preview, StoryContext, StoryFn, StoryObj, WebComponentsRenderer, getCustomElements, isValidComponent, isValidMetaData, setCustomElements, setCustomElementsManifest, setProjectAnnotations };
