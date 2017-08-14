
export function topic(accountId: string, deviceId: string, channel: string): string {
  return `xi/blue/v1/${accountId}/d/${deviceId}/${channel}`;
}

export function parseTopic(topic: string) {
  const parts = topic.split('/');
  return {
    accountId: parts[3],
    deviceId: parts[5],
    channel: parts[6],
  };
}
