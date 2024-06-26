import { mapper, toClass, toPlain, PrimitiveNumber, PrimitiveString } from '../../src';

class NestedValues {
  @mapper({ nameOrPath: 'test' })
  public Test: string;

  @mapper({ nameOrPath: 'dateTest', type: Date })
  public date: Date;
}

class CollectionTest {
  @mapper({ nameOrPath: 'TeSt' })
  public Test: string;

  @mapper({
    nameOrPath: 'customThings',
    convertFunc: (name: string, metadata: any, val: any, plain: any, convertToClass: boolean) => {
      console.log('convertFunc', name, val, plain);
      return val * 2;
    },
    rules: '',
  })
  public custom: number;
}

class UserClass {
  @mapper({ nameOrPath: 'testProp1' })
  public TestProp1: string = '';

  @mapper({ nameOrPath: 'nested.testProp2' })
  public TestProp2: string;

  @mapper({
    nameOrPath: 'odata.count',
    resolvePath: false,
    toClassOnly: true,
    type: PrimitiveNumber,
  })
  public TestProp3: number;

  @mapper({ nameOrPath: 'values', type: NestedValues })
  public Values: NestedValues;

  @mapper({ nameOrPath: 'collectiontest', type: CollectionTest })
  public Collectiontest: CollectionTest[];

  @mapper({ nameOrPath: 'onlyToClass', toClassOnly: true, type: PrimitiveString })
  public OnlyToClass: boolean;

  @mapper({ nameOrPath: 'nameOfPropInPlainOnlyRule2', toPlainOnly: true, rules: 'Test2' })
  @mapper({ nameOrPath: 'onlyToPlain', toPlainOnly: true })
  public OnlyToPlain: boolean;

  @mapper({ nameOrPath: 'nameOfPropInClassOnly', toClassOnly: true })
  @mapper({ nameOrPath: 'nameOfPropInPlainOnly', toPlainOnly: true })
  @mapper({ nameOrPath: 'nameOfPropInPlainOnlyRule', toPlainOnly: true, rules: ['Test'] })
  public OnlyToPlainOrClass: boolean;

  public get hasMore(): boolean {
    return this.TestProp3 > 0;
  }
}

var user = {
  testProp1: 'abc',
  nested: {
    testProp2: 'blahamucha',
  },
  'odata.count': '1',
  values: {
    test: 'abc',
    dateTest: '2023-02-09T18:47:41.452Z',
  },
  onlyToClass: true,
  onlyToPlain: false,
  nameOfPropInClassOnly: true,
  collectiontest: [
    {
      TeSt: 'abc',
      customThings: 2,
    },
    {
      TeSt: 'def',
      customThings: 4,
    },
    {
      TeSt: 'ghi',
      customThings: 8,
    },
  ],
};

var user2 = {
  testProp1: 'user 2',
  nested: {
    testProp2: 'blahamuha 2',
  },
  'odata.count': '1',
  values: {
    test: 'abc',
    dateTest: '2023-02-08T18:47:41.452Z',
  },
  collectiontest: [
    {
      TeSt: 'abc',
      customThings: 8,
    },
    {
      TeSt: 'def',
      customThings: 16,
    },
    {
      TeSt: 'ghi',
      customThings: 32,
    },
  ],
};

const userClass = toClass(UserClass, user);

const users = [user, user2];

const userCollection = toClass(UserClass, users);

console.log(userClass);

console.log('userCollection', userCollection);

console.log('toPlain', toPlain(userClass));
console.log('toPlain with rules', toPlain(userClass, { rules: 'Test' }));
userClass.OnlyToPlain = false;
console.log(
  'toPlain with rules and exclude',
  toPlain(userClass, { rules: ['Test2', 'Test'], excludeDefaultRule: true })
);
console.log('toPlainCollection', toPlain(userCollection));
