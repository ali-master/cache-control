const BooleanCacheControlDirectiveMap = {
  "no-cache": "no-cache",
  "no-store": "no-store",
  "no-transform": "no-transform",
  "only-if-cached": "only-if-cached",
  "must-revalidate": "must-revalidate",
  "proxy-revalidate": "proxy-revalidate",
  "must-understand": "must-understand",
  immutable: "immutable",
  private: "private",
  public: "public",
} as const;

type BooleanCacheControlDirective = keyof typeof BooleanCacheControlDirectiveMap;

const NumberCacheControlDirectiveMap = {
  "max-age": "max-age",
  "s-maxage": "s-maxage",
  "max-stale": "max-stale",
  "min-fresh": "min-fresh",
  "stale-while-revalidate": "stale-while-revalidate",
  "stale-if-error": "stale-if-error",
} as const;

type NumberCacheControlDirective = keyof typeof NumberCacheControlDirectiveMap;

const CacheControlDirectiveMap = {
  ...BooleanCacheControlDirectiveMap,
  ...NumberCacheControlDirectiveMap,
} as const;

type CacheControlDirective = keyof typeof CacheControlDirectiveMap;

type DirectiveValue<TDirective extends CacheControlDirective> =
  TDirective extends BooleanCacheControlDirective
    ? boolean | undefined
    : TDirective extends NumberCacheControlDirective
      ? number | undefined
      : never;

export class CacheControl {
  private directives: Partial<{
    [TDirective in CacheControlDirective]: DirectiveValue<TDirective>;
  }> = {};

  constructor(value?: string | null) {
    if (typeof value === "string") {
      this.parse(value);
    }
  }

  private parse(headerValue: string): void {
    const directives = headerValue.split(",").map((part) => part.trim());

    for (const directive of directives) {
      const [rawDirective, rawDirectiveValue] = directive.toLowerCase().split("=") as [
        string,
        string | undefined,
      ];

      const booleanDirective =
        BooleanCacheControlDirectiveMap[rawDirective as BooleanCacheControlDirective];
      if (booleanDirective) {
        this.directives[booleanDirective] = true;
        continue;
      }

      const numberDirective =
        NumberCacheControlDirectiveMap[rawDirective as NumberCacheControlDirective];
      if (numberDirective && rawDirectiveValue !== undefined) {
        const directiveValue = parseInt(rawDirectiveValue);
        if (!Number.isNaN(directiveValue)) {
          this.directives[numberDirective] = directiveValue;
        }
      }
    }
  }

  get<TDirective extends CacheControlDirective>(directive: TDirective): DirectiveValue<TDirective> {
    return this.directives[directive] as DirectiveValue<TDirective>;
  }

  set<TDirective extends CacheControlDirective>(
    directive: TDirective,
    value?: DirectiveValue<TDirective>,
  ): this {
    if (directive in BooleanCacheControlDirectiveMap) {
      this.directives[directive] = (value === true || value === undefined) as never;
    } else if (directive in NumberCacheControlDirectiveMap) {
      if (typeof value === "number" && value >= 0) {
        this.directives[directive] = value as never;
      }
    }
    return this;
  }

  toString(): string {
    const parts: string[] = [];

    for (const directive of Object.keys(this.directives) as CacheControlDirective[]) {
      const value = this.directives[directive];

      if (value === false || value === undefined) {
        continue;
      }

      if (value === true) {
        parts.push(directive);
        continue;
      }

      if (!Number.isNaN(value)) {
        parts.push(`${directive}=${value}`);
      }
    }

    return parts.join(", ");
  }

  clear(): this {
    this.directives = {};
    return this;
  }

  has<TDirective extends CacheControlDirective>(directive: TDirective): boolean {
    return directive in this.directives && this.directives[directive] !== undefined;
  }

  delete<TDirective extends CacheControlDirective>(directive: TDirective): this {
    delete this.directives[directive];
    return this;
  }

  static from(value?: string | null): CacheControl {
    return new CacheControl(value);
  }

  toJSON(): Partial<{
    [TDirective in CacheControlDirective]: DirectiveValue<TDirective>;
  }> {
    return { ...this.directives };
  }
}
