interface AppConfig {
  API_BASE: string;
}

let config: AppConfig | null = null;

export const getConfig = async (): Promise<AppConfig> => {
  if (config) {
    return config;
  }

  try {
    const response = await fetch('/app-config.json');
    config = await response.json();
    return config!;
  } catch (error) {
    console.error('Failed to load app config:', error);
    // Fallback config
    config = {
      API_BASE: 'http://127.0.0.1:8000/api/v1'
    };
    return config;
  }
};
