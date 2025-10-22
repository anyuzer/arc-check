type CheckFn = (value: string) => boolean;

declare class ArcCheck {
    constructor();
    reset(): void;
    addInclude(_includeCheck: RegExp | CheckFn): this;
    addExclude(_excludeCheck: RegExp | CheckFn): this;
    val(_string: string): boolean;
    toString(): string;
}

export default ArcCheck;
