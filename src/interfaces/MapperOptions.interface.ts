import { MapperType, ConvertFunction } from '../decorators'

export interface MapperOptions {
    /**
     * Name or path of property on the target object to map the value of this property.
     */
    nameOrPath?: string;

    resolvePath?: boolean;

    defaultValue?: any;

    type?: MapperType<any>;

    
    convertFunc?: ConvertFunction;
  
    /**
     * Expose this property only when transforming from plain to class instance.
     */
    toClassOnly?: boolean;
  
    /**
     * Expose this property only when transforming from class instance to plain object.
     */
    toPlainOnly?: boolean;
}