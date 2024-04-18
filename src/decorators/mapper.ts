import { MapperOptions, MapperMetadata } from '../interfaces';
import { mapperClassMetadataStore, mapperPlainMetadataStore, DEFAULT_RULE_NAME } from '../store';
import { isset } from '../utility';

export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export type MapperType<T> = { new (...args: any[]): T };

/**
 * This type is a user-defined conversion function when the toClass or toPlain method is executed for the specified property
 * In the function the this.-pointer can be used to access the class instance.
 * @param {string} nameOrPath The specified nameOrPath property from decorator
 * @param {MapperMetadata} metaData The specified properties from decorator
 * @param {any} value The property value from class or plain object
 * @param {any} plainOrClassObj The class or plain object (the source object to be converted from)
 * @param {boolean} convertToClass <c>true</c> if the function was called from toClass method, otherwise <c>false</c>
 * @returns The new and converted property value
 */
export type ConvertFunction = (
  nameOrPath: string,
  metaData: MapperMetadata,
  value: any,
  plainOrClassObj: any,
  convertToClass: boolean
) => any;

export function mapper(options: MapperOptions = {}): PropertyDecorator {
  return function (target: Object, propertyName: string | Symbol): void {
    const metaData: MapperMetadata = {
      target: target.constructor,
      options: options,
      propertyName: propertyName as string,
    };

    const addToClassStore: boolean =
      options.toClassOnly === true || (options.toPlainOnly !== true && !isset(options.toClassOnly));
    const addToPlainStore: boolean =
      options.toPlainOnly === true || (options.toClassOnly !== true && !isset(options.toPlainOnly));
    const rules: string[] = !isset(options.rules)
      ? [DEFAULT_RULE_NAME]
      : Array.isArray(options.rules)
      ? options.rules
      : [options.rules];

    rules.forEach((rule: string) => {
      if (addToClassStore) {
        if (!mapperClassMetadataStore.has(metaData.target)) {
          mapperClassMetadataStore.set(
            metaData.target,
            new Map<string, Map<string, MapperMetadata>>()
          );
        }

        if (!mapperClassMetadataStore.get(metaData.target).has(rule)) {
          mapperClassMetadataStore
            .get(metaData.target)
            .set(rule, new Map<string, MapperMetadata>());
        }

        mapperClassMetadataStore
          .get(metaData.target)
          .get(rule)
          .set(metaData.propertyName, metaData);
      }

      if (addToPlainStore) {
        if (!mapperPlainMetadataStore.has(metaData.target)) {
          mapperPlainMetadataStore.set(
            metaData.target,
            new Map<string, Map<string, MapperMetadata>>()
          );
        }

        if (!mapperPlainMetadataStore.get(metaData.target).has(rule)) {
          mapperPlainMetadataStore
            .get(metaData.target)
            .set(rule, new Map<string, MapperMetadata>());
        }

        mapperPlainMetadataStore
          .get(metaData.target)
          .get(rule)
          .set(metaData.propertyName, metaData);
      }
    });
  };
}