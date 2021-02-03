import { S3 } from 'aws-sdk';
import { Folder } from '../models';
import { DEFAUL_S3_PATH_SEPARATOR } from './constants';

export interface IS3DirectoryService {
  processDirectoryStructure(objects?: S3.Object[]): Folder;
}

export class S3DirectoryService implements IS3DirectoryService {
  processDirectoryStructure(objects?: S3.Object[]): Folder {
    try {
      const rootFolder: Folder = new Folder();

      if (!objects || !Array.isArray(objects) || !objects.length) return rootFolder;

      const process = (inputPath: string, obj: S3.Object, parent: Folder): Folder => {
        if (!inputPath.includes(DEFAUL_S3_PATH_SEPARATOR)) {
          // we have a "file"
          if (inputPath) {
            parent.addObject(obj);
          }

          return parent;
        }

        // we have a "folder"
        const [name, ...restPath] = inputPath.split(DEFAUL_S3_PATH_SEPARATOR);
        const folder = parent.ensureFolder(name);

        return process(restPath.join(DEFAUL_S3_PATH_SEPARATOR), obj, folder);
      };

      objects.forEach((curr) => {
        if (!curr.Key) return rootFolder;

        return process(curr.Key, curr, rootFolder);
      });

      return rootFolder;
    } catch (err) {
      throw err;
    }
  }
}

const s3DirectoryService: IS3DirectoryService = new S3DirectoryService();

export default s3DirectoryService;
