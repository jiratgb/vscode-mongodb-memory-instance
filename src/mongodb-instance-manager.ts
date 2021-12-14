import * as vscode from 'vscode';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

interface MongoInstanceConfig {
  dbVersion?: string
}

export class MongoInstanceManager {
  private instance: MongoMemoryServer | null = null;

  private getConfig() {
    const config = vscode.workspace.getConfiguration('mongodbMemoryInstance');
    const instanceConfig: MongoInstanceConfig = {
      dbVersion: config.get('dbVersion')
    };
    return instanceConfig;
  }

  initializeInstance(port: number, dbName: string | undefined) {
    const config = this.getConfig();
    this.instance = new MongoMemoryServer({
      instance: {
        port: port,
        dbName: dbName
      },
      binary: {
        version: config.dbVersion,
      },
    });
  }

  async startInstance() {
    await this.instance?.start(true);
  }

  getUri() {
    return this.instance?.getUri();
  }

  async stopAndCleanupInstance() {
    await this.instance?.stop(true);
    this.instance = null;
  }

  isInstanceInitialized() {
    return this.instance !== null;
  }

  isInstanceRunning() {
    return this.instance?.state === 'starting' || this.instance?.state === 'running';
  }
}