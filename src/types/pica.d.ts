declare module 'pica' {

    interface PicaConfig {
        tile?: number;
        features?: ('js' | 'wasm' | 'cib' | 'ww')[] | ["all"];
        idle?: number;
        concurrency?: number;
    }

    class Pica {
        constructor(config?: PicaConfig);

        resize(from: any, to: HTMLCanvasElement, options?: any): Promise<{}>;
        toBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob>;
        resizeBuffer(options: any): Promise<{}>;
    }

    export default Pica;
}



