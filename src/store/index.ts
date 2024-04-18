import { MapperMetadata } from '../interfaces';

export const DEFAULT_RULE_NAME: string = 'SPFxAppDevMapperDefaultRule';

export const mapperClassMetadataStore = new Map<
  Function,
  Map<string, Map<string, MapperMetadata>>
>();

export const mapperPlainMetadataStore = new Map<
  Function,
  Map<string, Map<string, MapperMetadata>>
>();