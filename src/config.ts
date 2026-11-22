import { ConfigStore } from '@kinvolk/headlamp-plugin/lib';

export interface HelloHeadlampConfig {
  /** Whether to show the Container Resources section on Pod detail pages. */
  showContainerResources: boolean;
}

export const DEFAULT_CONFIG: HelloHeadlampConfig = {
  showContainerResources: true,
};

// The key must match the plugin name passed to registerPluginSettings.
export const store = new ConfigStore<HelloHeadlampConfig>('hello-headlamp');

// Returns the saved config, filling any missing keys with defaults.
export function getConfig(): HelloHeadlampConfig {
  return { ...DEFAULT_CONFIG, ...store.get() };
}