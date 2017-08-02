export module Provision {
  export interface AccessMqttCredentialsResponse {
    mqttCredential: {
      accountId: string,
      entityId: string,
      entityType: string,
      secret: string,
    };
  }
}
