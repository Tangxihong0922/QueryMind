import { WebRenderer } from 'storybook/internal/types';
import { TemplateResult, SVGTemplateResult } from 'lit';

type StoryFnHtmlReturnType = string | Node | DocumentFragment | TemplateResult | SVGTemplateResult;
interface WebComponentsRenderer extends WebRenderer {
    component: string;
    storyResult: StoryFnHtmlReturnType;
}

export { WebComponentsRenderer as W };
