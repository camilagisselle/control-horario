import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();
const uuid = device.get();
console.log(uuid);

// Get device information
const info = device.parse();
console.log(info.browser); // Chrome
console.log(info.os); // Windows 11
console.log(info.isMobile); // false

export function getDeviceUUID() {
  const device = new DeviceUUID();
  const uuid = device.get();

  console.log("DEVICE UUID:", uuid);

  const info = device.parse();
  console.log("Device info:", info);

  return uuid;
}