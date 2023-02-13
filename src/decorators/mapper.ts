import { MapperOptions, MapperMetadata } from '../interfaces';
import { mapperMetadataStore } from '../store';

export type ClassConstructor<T> = {
    new (...args: any[]): T;
};

export type MapperType<T> = { new (...args: any[]): T };

//TODO: TBD
export type ConvertFunction = ((nameOrPath: string, metaData: MapperMetadata, value: any, plainOrClassObj: any, convertToClass: boolean) => any);


export function mapper(options: MapperOptions = {}): PropertyDecorator {
    

    return function (target: Object, propertyName: string | Symbol): void {
        // console.log("isFunction: ", object instanceof Function);
        const metaData: MapperMetadata = {
            target: target.constructor,
            options: options,
            propertyName: propertyName as string
        }

        if (!mapperMetadataStore.has(metaData.target)) {
            mapperMetadataStore.set(metaData.target, new Map<string, MapperMetadata>());
        }

        mapperMetadataStore.get(metaData.target).set(metaData.propertyName, metaData);
    };
}