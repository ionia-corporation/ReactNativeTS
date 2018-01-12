export function topic(accountId: string, deviceId: string, channel: string): string {
  return `xi/blue/v1/${accountId}/d/${deviceId}/${channel}`;
}

export interface ParsedTopic {
  topic: string;
  accountId: string;
  deviceId: string;
  channel: string;
}

// TODO create a test suite for this
export function parseTopic(topic: string): ParsedTopic {
  const parts = topic.split('/');
  return {
    topic,
    accountId: parts[3],
    deviceId: parts[5],
    // Channel might be some/long/path
    channel: parts.slice(6).join('/'),
  };
}
