# @spfxappdev/mapper

The @spfxappdev/mapper library is a powerful npm package that simplifies the conversion of plain JavaScript objects into class instances and vice versa.
It is similar to the "Auto-Mapper" libraries in other languages. It is actually designed for the SharePoint (SPFx) development and OData REST API's, but can be used for any other project as well.
You can use this package for both the frontend and the backend.

## Why to use the mapper package

In JavaScript, there are two kinds of objects:

- Plain objects: These are instances of the `Object` class. When created using curly braces `{}`, they're sometimes called literal objects (in TypeScript it is typically a `Record<Keys, Type>` Type).
- Class objects: These are instances of classes with their own defined constructor, properties, and methods. Typically, you create them using the `class` notation.

Modern web applications usually use a REST API and expect a plain (JSON) object for write accesses or return a plain object for read operations.

Sometimes you want to convert the plain object into your class because your class has better property names (in your opinion 😜) or additional methods or whatever. Or vice versa, you have a class instance and need to "send" a plain object with a different property name to the API to do something.

For example you have an API GET-Request that returns this JSON structure:

```typescript
[
    {
    "Id": 1,
    "Title": "Item 1",
    "SPFx_x0020_App_x0020_Dev_x0020_Status": "Done"
    },
    {
    "Id": 2,
    "Title": "Item 2",
    "SPFx_x0020_App_x0020_Dev_x0020_Status": "In Progress"
    },
    {
    "Id": 3,
    "Title": "Item 3",
    "SPFx_x0020_App_x0020_Dev_x0020_Status": "Not Started"
    }
]
```

> Note: As mentioned at the beginning of this document, this package is designed for SharePoint development and such ugly names as `SPFx_x0020_App_x0020_Dev_x0020_Status` are absolutely normal in SharePoint.

But you want to use your own defined class to use it in your code with nicer property names, like this:

```typescript
export class TaskItem {

    public id: number;

    public title: string;

    public status: string;

    public get isDone(): boolean {
        return this.status === "Done";
    }
}
```

Normally you would proceed like this:

```typescript
const allTaskItems: TaskItem[] = apiResult.map((item: any) => {
    const taskItem: TaskItem = new TaskItem();
    taskItem.id = item.Id;
    taskItem.title = item.Title;
    taskItem.status = item.SPFx_x0020_App_x0020_Dev_x0020_Status;
    return taskItem;
})
```

This is just a small and simple example. Imagine you have more properties or a conversion of types like number to string, string to date or nested properties.

And this is exactly when the mapper package should "join the game" 😁.

Simply adjust the (same) class as follows:

```typescript
import { mapper } from '@spfxappdev/mapper';

export class TaskItem {

    @mapper({ nameOrPath: 'Id' })
    public id: number;

    @mapper({ nameOrPath: 'Title' })
    public title: string;

    @mapper({ nameOrPath: 'SPFx_x0020_App_x0020_Dev_x0020_Status' })
    public status: string;

    public get isDone(): boolean {
        return this.status === "Done";
    }
}
```

And then use this:

```typescript
import { toClass } from '@spfxappdev/mapper';

const allTaskItems: TaskItem[] = toClass(TaskItem, apiResult);
```

And the result is the same as before. Easy, isn't it?

## Installation

```bash
npm i @spfxappdev/mapper
```

## Methods

### `toClass`

This method converts a plain javascript object to instance of specific class.

```typescript
import { toClass } from '@spfxappdev/mapper';

const allTaskItems: TaskItem[] = toClass(TaskItem, apiResult);
```

### `toPlain`

This method converts your class object back to plain object.

```typescript
import { toPlain } from '@spfxappdev/mapper';

const plainObj: any = toPlain(allTaskItems);
```

## Decorators

The decorators are helpful if you want to achieve a lot with less code and also fast. 

In order to better understand how decorators work, I recommend reading [this article](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841). 

> **Simple definition**: An ES2016 decorator is an expression which returns a function and can take a target, name and property descriptor as arguments. You apply it by prefixing the decorator with an @ character and placing this at the very top of what you are trying to decorate. Decorators can be defined for either a class, a method or a property.

You can only use a single, but very important decorator from this package. This decorator gives the package its name, the `mapper` decorator.



## Examples

In the `exmaples` folder of this repository you can find some examples


![normal vs. mapper decorators](./assets/mapperVsNormal.png)