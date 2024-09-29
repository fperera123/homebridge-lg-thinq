import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import Persist from '../lib/Persist';
import { API } from '../lib/API';
import { DeviceController } from './DeviceController';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default class LGServiceServer {
  private app: express.Application;
  private api: API | null = null;

  protected persist: Persist;
  protected deviceController: DeviceController | null = null;
  private deviceId: string;

  constructor() {
    this.deviceId = process.env.DEVICE_ID || 'default-device-id';

    console.log('Device ID:', this.deviceId);

    this.app = express();
    this.app.use(bodyParser.json());

    this.persist = new Persist(path.join(__dirname, 'persist', 'devices'));

    this.ready().then(() => {
      // this.setupRoutes();
    });
  }

  private async ready() {

    await this.persist.init();
    this.api = new API('LK', 'en-LK');

    const username = process.env.USERNAME || 'default-username';
    const password = process.env.PASSWORD || 'default-password';

    this.api.setUsernamePassword(username, password);

    await this.api.ready();
    console.info('API is ready');

    this.deviceController = new DeviceController(this.api);

    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.get('/temperature', this.setTargetTemperature.bind(this)); // Use GET to match your example
  }

  private setTargetTemperature(req: express.Request, res: express.Response) {
    const value = Number(req.query.v);

    if (!this.deviceController) {
      res.status(500).json({ error: 'Device controller is not initialized' });
      return;
    }

    if (isNaN(value)) {
      res.status(400).json({ error: 'Invalid temperature value' });
      return;
    }

    // Call the deviceControl method with the temperature value
    this.deviceController.deviceControl(this.deviceId, {
      dataKey: 'airState.tempState.target',
      dataValue: value,
    })
      .then(() => {
        res.status(200).json({ message: `Cooling to ${value}` });
      })
      .catch((error) => {
        console.error('Error setting temperature:', error);
        res.status(500).json({ error: 'Failed to set temperature' });
      });
  }

  public startServer(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
