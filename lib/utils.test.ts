import { describe, expect, it } from "vitest"

import { cn, slugify } from "@/lib/utils"

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
    expect(cn("text-sm", false && "hidden", "font-bold")).toBe(
      "text-sm font-bold"
    )
  })
})

describe("slugify", () => {
  it("lowercases and dasherizes text", () => {
    expect(slugify("Galaxy Pro X Max")).toBe("galaxy-pro-x-max")
  })

  it("strips non-alphanumeric characters", () => {
    expect(slugify("AirWave Pro (2024)!")).toBe("airwave-pro-2024")
  })

  it("trims leading/trailing dashes", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world")
  })
})
