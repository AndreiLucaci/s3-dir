import { S3 } from 'aws-sdk';
export declare class Folder {
    objects?: S3.Object[];
    parent?: string;
    name?: string;
    folders?: Folder[];
    constructor(name?: string, parent?: string);
    addObject(input: S3.Object): void;
    ensureFolder(name: string): Folder;
    all(): (Folder | S3.Object)[];
    toJson(): string;
    toObject(): any;
}
