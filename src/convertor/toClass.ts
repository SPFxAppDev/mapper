import { getDeepOrDefault, isFunction, isset, toBoolean } from '../utility';
import { ClassConstructor } from '../decorators';
import { mapperClassMetadataStore, DEFAULT_RULE_NAME } from '../store';
import { MapperMetadata } from '../interfaces';
import { PrimitiveBoolean, PrimitiveNumber, PrimitiveString } from '../primitiveTypeClasses';
import { ConvertOptions } from './';

/**
 * Converts plain (literal) object to the specified class (parameterless constructor) object. Also works with arrays.
 * @param targetType The type/class (parameterless constructor) that is created after the conversion
 * @param plain The "source" object / the plain (literal) object
 * @param {ConvertOptions} options Optional parameters of type ConvertOptions to be used for the conversion, such as rule name(s).
 * @returns A new instance of the specified <c>targetType</c> class
 */
export function toClass<TResult, TPlain extends Array<any>>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain,
  options?: ConvertOptions
): TResult[];
export function toClass<TResult, TPlain>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain,
  options?: ConvertOptions
): TResult;
export function toClass<TResult, TPlain>(
  targetType: ClassConstructor<TResult>,
  plain: TPlain,
  options?: ConvertOptions
): TResult | TResult[] {
  if (!mapperClassMetadataStore.has(targetType)) {
    return new targetType();
  }

  if (Array.isArray(plain)) {
    const collection = [];
    for (let p of plain) {
      collection.push(toClass(targetType, p));
    }

    return collection;
  }

  const rulesMap = mapperClassMetadataStore.get(targetType);

  const newObj: TResult = new targetType();

  const optionRules = getDeepOrDefault(options, 'rules', undefined);
  const optionExcludeDefaultRule = getDeepOrDefault(options, 'excludeDefaultRule', false);

  const rules: string[] = !isset(optionRules)
    ? []
    : Array.isArray(options.rules)
    ? options.rules
    : [options.rules];
  const excludeDefaultRule = isset(optionRules) && optionExcludeDefaultRule;

  if (!excludeDefaultRule) {
    rules.push(DEFAULT_RULE_NAME);
  }

  const mappedProperties: Record<string, boolean> = {};

  rules.forEach((rule: string) => {
    if (!rulesMap.has(rule)) {
      return;
    }

    const metaDataMap: Map<string, MapperMetadata> = rulesMap.get(rule);

    metaDataMap.forEach((metadata: MapperMetadata, propertyNameOrPath: string) => {
      const opts = metadata.options;

      if (opts.toClassOnly === false || (!isset(opts.toClassOnly) && opts.toPlainOnly === true)) {
        return;
      }

      if (isset(mappedProperties[metadata.propertyName])) {
        return;
      }

      mappedProperties[metadata.propertyName] = true;

      let propVal = opts.defaultValue;
      const name: string = opts.nameOrPath || metadata.propertyName;

      if (opts.resolvePath === false) {
        propVal = plain[name] || propVal;
      } else {
        propVal = getDeepOrDefault(plain, name, propVal);
      }

      if (isFunction(opts.convertFunc)) {
        newObj[propertyNameOrPath] = opts.convertFunc.call(
          newObj,
          name,
          metadata,
          propVal,
          plain,
          true
        );
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

          if (mapperClassMetadataStore.has(opts.type)) {
            mappingWasResolved = true;
            value = toClass(opts.type, collection[i]);
            setValue(value);
            continue;
          }

          const instanceOfPropertyType = new opts.type();

          if (instanceOfPropertyType instanceof Date) {
            mappingWasResolved = true;
            value = new Date(collection[i]);
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
  });

  return newObj;
}
