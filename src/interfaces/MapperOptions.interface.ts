import { MapperType, ConvertFunction } from '../decorators'

export interface MapperOptions {
  /**
   * Name or path for/from the property. If not specified, the property name of the class is used!
   * When using the toClass method, the property is read from the plain object and set to the class object.
   * When using the toPlain method, the property value of the class object is converted into the specified name or path of the plain object
   * IMPORTANT: If the name of your property contains a dot, you must set the mapper option resolvePath to false.
   * @example 'MyPropArray.0.id' ==> gets or sets the property "id" from the first array value
   * @example 'MyPropObj.user.id' ==> gets or sets the property "id" from the object "MyPropObj" and the nested object "user"
   * @example 'myProp' ==> gets or sets the value from the property "myProp"
   * @example 'odata.count' ==> gets or sets the value of the property with the name "odata.count".
   */
  nameOrPath?: string;

  /**
   * Determines whether the specified nameOrPath option should be handled as a path (for nested objects) or not.
   * Set this value to true if your property name contains a dot.
   * @default true
   */
  resolvePath?: boolean;

  /**
   * The default value of the class/plain object property if the specified nameOrPath option could not be found
   */
  defaultValue?: any;

  /**
   * Specifies a type of the class property. For primitive types (number, string, boolean) please use the classes PrimitiveString, PrimitiveNumber and PrimitiveBoolean from this package
   * If the specified type is a DateTime, it is tried to convert it to DateTime
   * It is recommended that the specified type also uses the mapper decorators
   * IMPORTANT: Only parameterless class constructors are supported
   */
  type?: MapperType<any>;

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
  convertFunc?: ConvertFunction;

  /**
   * Convert this property only when converting from plain to class instance.
   * @default false
   */
  toClassOnly?: boolean;

  /**
   * Convert this property only when converting from class instance to plain object.
   * @default false
   */
  toPlainOnly?: boolean;

  /**
   * A string or an array of string values for defining a rule name.
   * The name of the rule(s) can be specified in the "toPlain" and "toClass" methods.
   * This option should be used with multiple mapper decorators for the same property
   * @example If you use the same class for different API requests that return different property names, you can define rule names.
   * During the conversion process, you can specify the name of the rule(s) to be used. Then the mapper knows which property name (and configuration) should be mapped to the target object
   */
  rules?: string | string[];
}