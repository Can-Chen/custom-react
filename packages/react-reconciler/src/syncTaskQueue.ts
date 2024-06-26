let syncQueue: ((...args: any) => void)[] | null = null;
let isFlushingSyncQueue = false;

export function scheduleSyncCallback(callback: (...args: any) => void) {
  if (syncQueue === null) {
    syncQueue = [callback];
  } else {
    syncQueue.push(callback);
  }
}

export function flushSyncCallbacks() {
  if (!isFlushingSyncQueue && syncQueue) {
    isFlushingSyncQueue = true;
    try {
      syncQueue.forEach((cb) => cb());
    } catch (error) {
      // @ts-ignore
      if (__DEV__) {
        console.error("flushSyncCallbacks报错", error);
      }
    } finally {
      isFlushingSyncQueue = false;
      syncQueue = null;
    }
  }
}
