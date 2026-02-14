export interface PanelConfig {
  defaultSize: number;
  minSize: number;
  maxSize: number;
}

export interface WorkbenchState {
  endpoint: string;
  isConnected: boolean;
  isExecuting: boolean;
}
