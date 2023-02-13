import { MapperOptions } from "./";

export interface MapperMetadata {
    target: Function;
  
    /**
     * The property name this metadata belongs to on the target (property).
     *
     * Note: If the decorator is applied to a class the propertyName will be undefined.
     */
    propertyName: string;
  
    /**
     * Options passed to the @mapper operator for this property.
     */
    options: MapperOptions;
}