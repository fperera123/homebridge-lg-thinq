import { API } from '../lib/API';
import { Device } from '../lib/Device';

export class DeviceController {
    private api: API;

    constructor(api: API) {
      this.api = api;
      //   this.getDevices();
    }

    // public async getDevices() {
    //   const devices = await this.api.getListDevices();

    //   console.log('Devices:', devices);

    // }

    public deviceControl(
      device: string | Device,
      values: Record<string, any>,
      command: 'Set' | 'Operation' = 'Set',
      ctrlKey = 'basicCtrl',
      ctrlPath = 'control-sync') {
      const id = device instanceof Device ? device.id : device;
      return this.api.sendCommandToDevice(id, values, command, ctrlKey, ctrlPath)
        .then(response => {
          if (response.resultCode === '0000') {
            console.info('ThinQ Device Received the Command');
            return true;
          } else {
            console.error('ThinQ Device Did Not Received the Command');
            return false;
          }
        });
    }
}
