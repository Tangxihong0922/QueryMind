import { simulatePageLoad, simulateDOMContentLoaded } from 'storybook/internal/preview-api';
import { global } from '@storybook/global';
import { render as render$1 } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';
import { dedent } from 'ts-dedent';

var __defProp=Object.defineProperty;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0});};var entry_preview_exports={};__export(entry_preview_exports,{parameters:()=>parameters,render:()=>render,renderToCanvas:()=>renderToCanvas});var {Node}=global,render=(args,context)=>{let{id,component}=context;if(!component)throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`);let element=document.createElement(component);return Object.entries(args).forEach(([key,val])=>{element[key]=val;}),element};function renderToCanvas({storyFn,kind,name,showMain,showError,forceRemount},canvasElement){let element=storyFn();if(showMain(),isTemplateResult(element)){(forceRemount||!canvasElement.querySelector('[id="root-inner"]'))&&(canvasElement.innerHTML='<div id="root-inner"></div>');let renderTo=canvasElement.querySelector('[id="root-inner"]');render$1(element,renderTo),simulatePageLoad(canvasElement);}else if(typeof element=="string")canvasElement.innerHTML=element,simulatePageLoad(canvasElement);else if(element instanceof Node){if(canvasElement.firstChild===element&&!forceRemount)return;canvasElement.innerHTML="",canvasElement.appendChild(element),simulateDOMContentLoaded();}else showError({title:`Expecting an HTML snippet or DOM node from the story: "${name}" of "${kind}".`,description:dedent`
        Did you forget to return the HTML snippet from the story?
        Use "() => <your snippet or node>" or when defining the story.
      `});}var parameters={renderer:"web-components"};

export { entry_preview_exports, parameters, render, renderToCanvas };
