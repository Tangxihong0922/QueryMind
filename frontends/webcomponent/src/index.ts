// Log build information when the module loads
console.log(
  '%c🎨 QueryMind Web Components',
  'color: #4CAF50; font-weight: bold; font-size: 14px;'
);
console.log(
  `%c📦 Version: ${__BUILD_VERSION__}`,
  'color: #2196F3; font-weight: bold;'
);
console.log(
  `%c🕐 Built: ${__BUILD_TIME__}`,
  'color: #FF9800; font-weight: bold;'
);
console.log(
  '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'color: #9E9E9E;'
);

export { QueryMindChat } from './components/querymind-chat';
export { QueryMindMessage } from './components/querymind-message';
export { QueryMindStatusBar } from './components/querymind-status-bar';
export { QueryMindProgressTracker } from './components/querymind-progress-tracker';
// Legacy Vanna-compatible exports
export { QueryMindMessage as VannaMessage } from './components/querymind-message';
export { QueryMindStatusBar as VannaStatusBar } from './components/querymind-status-bar';
export { QueryMindProgressTracker as VannaProgressTracker } from './components/querymind-progress-tracker';
export { PlotlyChart } from './components/plotly-chart';
export { SchemaManagementPage } from './components/schema-management-page';

// Rich component system
export {
  ComponentRegistry,
  ComponentManager,
  CardComponentRenderer,
  TaskListComponentRenderer,
  ProgressBarComponentRenderer,
  NotificationComponentRenderer,
  StatusIndicatorComponentRenderer,
  TextComponentRenderer
} from './components/rich-component-system';

// Rich component styles are injected automatically by the ComponentManager
