const env = import.meta.env;

export const MQTT_BROKER = env.MQTT_BROKER;
export const MQTT_USER = env.MQTT_USER;
export const MQTT_PASSWORD = env.MQTT_PASSWORD;
export const MQTT_TOPIC = env.MQTT_TOPIC;

export const TEMPO_OFFLINE = 90000;
export const LIMITE_SEGURANCA = 40;
export const MAX_EVENTOS_HISTORICO = 10;
