export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';
export type GlobalSyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

export type SyncEntityType =
  | 'unit_progress'
  | 'learning_state'
  | 'user_preferences'
  | 'learning_activity';

export interface SyncQueueItem<T = unknown> {
  id: string;
  entityType: SyncEntityType;
  action: 'insert' | 'update' | 'upsert' | 'delete';
  payload: T;
  enqueuedAt: string;
  retryCount: number;
  status: SyncStatus;
  lastError?: string;
}

export interface FavoriteItem {
  id: string;
  deleted: boolean;
  updated_at: string;
}

export interface HistoryItem {
  path: string;
  title: string;
  visited_at: string;
}

export interface GuestImportBatch {
  batchId: string;
  unitVersionIds: string[];
  createdAt: string;
}

export interface StorageNamespace {
  prefix: string;
  progressKey: string;
  stateKey: string;
  preferencesKey: string;
  statsKey: string;
  activitiesKey: string;
  labExecPrefix: string;
  queueKey: string;
  deadletterKey: string;
}

export function getStorageNamespace(userId: string | null): StorageNamespace {
  const prefix = userId ? `case_u_${userId}:` : 'case_guest:';
  return {
    prefix,
    progressKey: `${prefix}unit_progress`,
    stateKey: `${prefix}learning_state`,
    preferencesKey: `${prefix}preferences`,
    statsKey: `${prefix}stats`,
    activitiesKey: `${prefix}activities`,
    labExecPrefix: `${prefix}lab_exec_`,
    queueKey: `${prefix}queue`,
    deadletterKey: `${prefix}deadletter`,
  };
}
