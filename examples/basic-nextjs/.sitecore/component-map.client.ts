// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

import * as ContentTwinClient from 'src/components/Promo/ContentTwinClient';
import * as AgentDemoClient from 'src/components/Promo/AgentDemoClient';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['ContentTwinClient', { ...ContentTwinClient }],
  ['AgentDemoClient', { ...AgentDemoClient }],
]);

export default componentMap;
