import { getDeepOrDefault, isFunction, isset, toBoolean } from '../utility';
import { ClassConstructor } from '../decorators';
import { mapperMetadataStore } from '../store';
import { MapperMetadata } from '../interfaces';
import { PrimitiveBoolean, PrimitiveNumber, PrimitiveString } from '../primitiveTypeClasses';

export function toClass<TResult, TPlain extends Array<any>>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain
): TResult[];
export function toClass<TResult, TPlain>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain
): TResult;
export function toClass<TResult, TPlain>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain
): TResult | TResult[] {
  if (!mapperMetadataStore.has(targetType)) {
    return new targetType();
  }

  //TODO: Schauen ob es evtl. zu optimierne geht....
  if (Array.isArray(plain)) {
    const collection = [];
    for (let p of plain) {
      collection.push(toClass(targetType, p));
    }

    return collection;
  }

  const metaDataMap = mapperMetadataStore.get(targetType);

  const newObj: TResult = new targetType();

  metaDataMap.forEach((metadata: MapperMetadata, propertyNameOrPath: string) => {
    const opts = metadata.options;

    if (opts.toClassOnly === false || (!isset(opts.toClassOnly) && opts.toPlainOnly === true)) {
      return;
    }

    let propVal = opts.defaultValue;
    const name: string = opts.nameOrPath || metadata.propertyName;

    if (opts.resolvePath === false) {
      propVal = plain[name] || propVal;
    } else {
      propVal = getDeepOrDefault(plain, name, propVal);
    }

    if (isFunction(opts.convertFunc)) {
      newObj[propertyNameOrPath] = opts.convertFunc(name, metadata, propVal, plain, true);
      return;
    }

    if (isset(propVal) && isset(opts.type)) {
      const isArray = Array.isArray(propVal);
      let collection = isArray ? propVal : [propVal];
      let mappingWasResolved: boolean = false;

      if (isArray) {
        newObj[propertyNameOrPath] = [];
      }

      const setValue = (value: any) => {
        if (isArray) {
          newObj[propertyNameOrPath].push(value);
          return;
        }

        newObj[propertyNameOrPath] = value;
      };

      for (let i = 0; i < collection.length; i++) {
        let value: any = undefined;

        if (mapperMetadataStore.has(opts.type)) {
          mappingWasResolved = true;
          value = toClass(opts.type, collection[i]);
          // if(isArray) {
          //     newObj[propertyNameOrPath].push(value);
          //     continue;
          // }

          // newObj[propertyNameOrPath] = value;
          setValue(value);
          continue;
        }

        const instanceOfPropertyType = new opts.type();

        if (instanceOfPropertyType instanceof Date) {
          mappingWasResolved = true;
          value = new Date(collection[i]);

          // if(isArray) {
          //     newObj[propertyNameOrPath].push(value);
          //     continue;
          // }

          // newObj[propertyNameOrPath] = value;
          setValue(value);
          continue;
        }

        if (instanceOfPropertyType instanceof PrimitiveBoolean) {
          mappingWasResolved = true;
          value = toBoolean(collection[i]);
          setValue(value);
          continue;
        }

        if (instanceOfPropertyType instanceof PrimitiveNumber) {
          mappingWasResolved = true;
          value = +collection[i];
          setValue(value);
          continue;
        }

        if (instanceOfPropertyType instanceof PrimitiveString) {
          try {
            mappingWasResolved = true;

            value = collection[i];

            if (isFunction(value.toSting)) {
              value = value.toString();
            }

            value += '';

            setValue(value);
            continue;
          } catch (err) {
            console.error('ERROR while try to convert the value to string');
          }
        }
      }

      if (mappingWasResolved) {
        return;
      }
    }

    newObj[propertyNameOrPath] = propVal;
  });

  return newObj;
}
