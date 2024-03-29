/**
 * Determines if the provided Property is set.
 * @param {any} property The Property to checked.
 * @returns {boolean} If the Property is set <c>true</c> otherwise <c>false</c>.
 * @since 1.0.0
 */
export function isset(property: any): boolean {
    return typeof property !== 'undefined' && property != null;
}

/**
 * Gets an nested property from an specific object or default, if not isset.
 * @param {any} objectToCheck The Property to checked.
 * @param {string} keyNameSpace The Key-Namespace of the Property (for example: "My.Nested.Property").
 * @param {any} defaultValue The defaultValue if property not exist.
 * @returns {any} If the Property is set, than the requested property otherwise defaultValue.
 * @since 1.0.0
 */
export function getDeepOrDefault<TResult>(objectToCheck: any, keyNameSpace: string, defaultValue: TResult = null): TResult {
    if (!isset(objectToCheck)) {
        return defaultValue;
    }

    const namespaceKeys: string[] = keyNameSpace.split('.');
    let currentObjectPath: any = objectToCheck;

    for (let i: number = 0; i < namespaceKeys.length; i++) {
        const currentKey: string = namespaceKeys[i];

        if (!isset(currentObjectPath[currentKey])) {
            return defaultValue;
        }

        currentObjectPath = currentObjectPath[currentKey];
    }

    return !isset(currentObjectPath) ? defaultValue : currentObjectPath as TResult;
}

/**
 * Determines wheter the Property is a Function.
 * @param {any} property The Property to be determined.
 * @returns {boolean} Wheter the Property is a Function.
 * @since 1.0.0
 */
export function isFunction(property: any): boolean {
    return isset(property) && typeof property === 'function';
}

/**
 * Converts a value to a Boolean.
 * @param {any} value The Value to be converted to a Boolean. Valid values are: true, false, 'true' (case insensitive), 'false' (case insensitive), 1, 0, '1', '0'
 * @returns {boolean} If the Value is convertable to a Boolean it
 * is returned as a Boolean otherwise <c>false</c> is returned.
 * @since 1.0.0
 */
export function toBoolean(value: any): boolean {
    if (!isset(value)) {
        return false;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        value = value.toLowerCase();
    }

    if ((value !== 'false' && value !== 'true') &&
        (value !== '0' && value !== '1') &&
        (value !== 0 && value !== 1)) {
        return false;
    }

    return (value === 'false' || value === '0' || value === 0) ? false : true;
}