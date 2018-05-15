export = K

declare function K (): never
declare function K (object: null | undefined): never
declare function K <ObjectType> (object: ObjectType): FastKeys.IFastKeys<ObjectType>

declare namespace FastKeys {
    export interface IFastKeys <ObjectType> {
        length: number;

        some(iteratee: Predicate<ObjectType>): boolean
        every(iteratee: Predicate<ObjectType>): boolean
        filter(iteratee: Predicate<ObjectType>): Array<keyof ObjectType>
        forEach(iteratee: (key: keyof ObjectType) => void): void
        map<A>(iteratee: (key: keyof ObjectType) => A): Array<A>

        toSet(): Set<keyof ObjectType>
    }
}

type Predicate <ObjectType> = (key: keyof ObjectType) => boolean
