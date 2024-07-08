// This file can be used to add references for global types like `vite/client`.

// Add global `vite/client` types. For more info, see: https://vitejs.dev/guide/features#client-types
/// <reference types="vite/client" />

type CanvasDataStore = {
    data: number[];
    dataCount: number;
    maxNumberSize: number;
    generateRandomData: QRL<(this: CanvasDataStore) => void>;
    selection: number[];
    clearInterval?: NoSerialize<() => void>;
    animationIntervalTimeout: number;
    sortDataAtIndex: QRL<(this: CanvasDataStore) => boolean>;
    isDataSorted: QRL<(this: CanvasDataStore) => boolean>;
    steps: {data: number[], selection: number[]}[];
}