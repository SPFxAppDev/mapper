import { getDeepOrDefault, isFunction, isset } from '../utility';
import { mapperMetadataStore } from '../store';
import { MapperMetadata } from '../interfaces';

export function toPlain<T>(obj: T[]): Record<string, any>[];
export function toPlain<T>(obj: T): Record<string, any>
export function toPlain<T>(obj: T): Record<string, any> | Record<string, any>[] {
    
    const objConstructor = (obj as Object).constructor;

    if(Array.isArray(obj)) {
        const collection = [];
        for(let o of obj) {
            collection.push(toPlain(o));
        }

        return collection;
    }

    const returnVal = {}
    if(!mapperMetadataStore.has(objConstructor)) {
        return returnVal;
    }

    const metaDataMap = mapperMetadataStore.get(objConstructor);

    metaDataMap.forEach((metadata: MapperMetadata, propertyNameOrPath: string) => {
        const opts = metadata.options;

        if(opts.toPlainOnly === false || (!isset(opts.toPlainOnly) && opts.toClassOnly === true)) {
            return;
        }

        let propVal = opts.defaultValue;
        const name: string = metadata.propertyName;
        const plainObjPropName = opts.nameOrPath||metadata.propertyName;

        if(isFunction(opts.convertFunc)) {
            (returnVal as any)[plainObjPropName] = opts.convertFunc(name, metadata, propVal, obj, false);
            return;
        }

        if (opts.resolvePath === false) {
            propVal = (obj as any)[name]||propVal;
            // (returnVal as any)[plainObjPropName] = propVal;

            if(typeof propVal != "object") {
                (returnVal as any)[plainObjPropName] = propVal;
                return;
            }

            const valConstructor = (propVal as Object).constructor;

            if(!mapperMetadataStore.has(valConstructor)) {
                (returnVal as any)[plainObjPropName] = JSON.parse(JSON.stringify(propVal));
                return;
            }

            (returnVal as any)[plainObjPropName] = toPlain(propVal);
        }
        else {
            propVal = getDeepOrDefault(obj, name, propVal);
            const namespaceKeysTarget: string[] = plainObjPropName.split('.');
            let currentReturnObjectPath: any = returnVal;

            for (let i: number = 0; i < namespaceKeysTarget.length; i++) {
                const currentKey: string = namespaceKeysTarget[i];
                

                if(!isset(propVal)) {
                    currentReturnObjectPath[currentKey] = null;

                    break;
                }

                if(i == namespaceKeysTarget.length - 1) {

                    if(!Array.isArray(propVal)) {

                        if(typeof propVal != "object") {
                            currentReturnObjectPath[currentKey] = propVal;
                            break;
                        }
    
                        const valConstructor = (propVal as Object).constructor;
    
                        if(!mapperMetadataStore.has(valConstructor)) {
                            currentReturnObjectPath[currentKey] = JSON.parse(JSON.stringify(propVal));
                            break;
                        }

                        currentReturnObjectPath[currentKey] = toPlain(propVal);
                        break;
                    }
                    currentReturnObjectPath[currentKey] = [];

                    for (let j: number = 0; j < propVal.length; j++) {
                        const val = propVal[j];

                        if(typeof val != "object") {
                            currentReturnObjectPath[currentKey].push(val);
                            continue;
                        }

                        const valConstructor = (val as Object).constructor;

                        if(!mapperMetadataStore.has(valConstructor)) {
                            currentReturnObjectPath[currentKey].push(JSON.parse(JSON.stringify(propVal)));
                            continue;
                        }
                        
                        currentReturnObjectPath[currentKey].push(toPlain(val));
                    }
                }

                if(!isset(currentReturnObjectPath[currentKey])) {
                    currentReturnObjectPath[currentKey] = {};
                }
                
                currentReturnObjectPath = currentReturnObjectPath[currentKey];
            }
        }
    });

    return returnVal;
}