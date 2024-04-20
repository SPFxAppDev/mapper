import { MapperOptions } from "./";

export interface MapperMetadata {
  /**
   * The parameterless constructor function of the object
   */
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