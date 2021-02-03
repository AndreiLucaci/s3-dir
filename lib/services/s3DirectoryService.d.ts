import { S3 } from 'aws-sdk';
import { Folder } from '../models';
export interface IS3DirectoryService {
    processDirectoryStructure(objects?: S3.Object[]): Folder;
}
export declare class S3DirectoryService implements IS3DirectoryService {
    processDirectoryStructure(objects?: S3.Object[]): Folder;
}
declare const s3DirectoryService: IS3DirectoryService;
export default s3DirectoryService;
