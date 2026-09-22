function requireEnv(name: string): string {
  const value = import.meta.env[name] as string | undefined;

  if (!value) {
    throw new Error(
      `Variavel de ambiente ${name} nao definida. Copie .env.example para .env e preencha os valores.`,
    );
  }

  return value;
}

export function getMqttConfig() {
  return {
    broker: requireEnv('VITE_MQTT_BROKER'),
    user: requireEnv('VITE_MQTT_USER'),
    password: requireEnv('VITE_MQTT_PASSWORD'),
    topic: requireEnv('VITE_MQTT_TOPIC'),
  };
}

export function getGoogleClientId(): string {
  return requireEnv('VITE_GOOGLE_CLIENT_ID');
}
