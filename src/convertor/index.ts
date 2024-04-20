export * from './toClass';
export * from './toPlain';

/**
 * Additional conversion options type for the methods toClass and toPlain.
 */
export type ConvertOptions = {
  /**
   * A string or an array of string values to define a rule name to be used during the conversion process. Only mapper decorators that also have this rule name(s) are then taken into the conversion process
   * IMPORTANT: If the excludeDefaultRule option (default = false) is set to false, all mapper decorators that have not specified a rule property are also included
   */
  rules?: string | string[];

  /**
   * If set to <c>true</c>, only mapper decorators that have this rule name(s) are included in the conversion process, otherwise all mapper decorators with the specified rule name(s) AND all mapper decorators that have not specified a rule property are included
   * @default false
   */
  excludeDefaultRule?: boolean;
};