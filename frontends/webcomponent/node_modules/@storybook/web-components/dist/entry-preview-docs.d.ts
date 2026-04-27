import { SourceType } from 'storybook/internal/docs-tools';
import { DecoratorFunction, InputType, ArgTypesEnhancer } from 'storybook/internal/types';
import { W as WebComponentsRenderer } from './types-9976a2c9.js';
import 'lit';

declare const decorators: DecoratorFunction<WebComponentsRenderer>[];
declare const parameters: {
    docs: {
        extractArgTypes: (tagName: string) => {
            [x: string]: InputType;
        } | null | undefined;
        extractComponentDescription: (tagName: string) => string | null | undefined;
        story: {
            inline: true;
        };
        source: {
            type: SourceType;
            language: string;
        };
    };
};
declare const argTypesEnhancers: ArgTypesEnhancer<WebComponentsRenderer>[];

export { argTypesEnhancers, decorators, parameters };
