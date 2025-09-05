export interface IconProps {
    size: "lg" | "md" | "sm"
}

export const sizeVariants = {
    "lg": "size-6",
    "md": "size-5",
    "sm": "size-2"
} as const; //The as const assertion in the types file ensures that the size variants are treated as readonly literal types, which provides better type safety.

