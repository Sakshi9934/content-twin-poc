// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Promo from 'src/components/Promo/Promo';
import * as ContentTwinClient from 'src/components/Promo/ContentTwinClient';
import * as contenttwincomponent from 'src/components/Promo/content-twin-component';
import * as AgentDemoClient from 'src/components/Promo/AgentDemoClient';
import * as agentdemo from 'src/components/Promo/agent-demo';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as Navigation from 'src/components/Navigation/Navigation';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['Promo', { ...Promo }],
  ['ContentTwinClient', { ...ContentTwinClient, componentType: 'client' }],
  ['content-twin-component', { ...contenttwincomponent }],
  ['AgentDemoClient', { ...AgentDemoClient, componentType: 'client' }],
  ['agent-demo', { ...agentdemo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['Navigation', { ...Navigation }],
]);

export default componentMap;
