import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class CrazyRouterProvider extends BaseProvider {
  name = 'CrazyRouter';
  getApiKeyLink = 'https://crazyrouter.com/dashboard';

  config = {
    baseUrl: 'https://cn.crazyrouter.com/v1',
    apiTokenKey: 'CRAZY_ROUTER_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'crazy-model-v1',
      label: 'Crazy Model V1',
      provider: 'CrazyRouter',
      maxTokenAllowed: 128000,
    },
  ];

  async getDynamicModels(
    _apiKeys?: Record<string, string>,
    _settings?: IProviderSetting,
    _serverEnv: Record<string, string> = {},
  ): Promise<ModelInfo[]> {
    try {
      const { apiKey } = this.getProviderBaseUrlAndKey({
        apiKeys: _apiKeys,
        providerSettings: _settings,
        serverEnv: _serverEnv,
        defaultBaseUrlKey: '',
        defaultApiTokenKey: 'CRAZY_ROUTER_API_KEY',
      });

      if (!apiKey) {
        return this.staticModels;
      }

      const response = await fetch(`${this.config.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        return this.staticModels;
      }

      return data.data.map((m: any) => ({
        name: m.id,
        label: m.name || m.id,
        provider: this.name,
        maxTokenAllowed: m.context_length || 128000,
      }));
    } catch (error) {
      console.error('Error getting CrazyRouter models:', error);
      return this.staticModels;
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'CRAZY_ROUTER_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const crazyRouter = createOpenAI({
      apiKey,
      baseURL: baseUrl || this.config.baseUrl,
    });

    return crazyRouter(model);
  }
}
