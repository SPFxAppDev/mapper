import { MapperOptions } from "./";

export interface MapperMetadata {
    target: Function;
  
    /**
     * The property name this metadata belongs to on the target (property).
     *
     */
    propertyName: string;
  
    /**
     * Options passed to the @mapper operator for this property.
     */
    options: MapperOptions;
}