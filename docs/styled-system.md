# Styling

The dahsboard application makes use of [Styled Components](https://styled-components.com) in combination
with [Styled System](https://styled-system.com) for, respectively, its CSS-IN-JSS and theming solutions.

## Theme

The theme that holds all of the styling constants is located at **app/src/style/them.ts**. This contains
all styling information, so fonts, font sizes, font weights, colors, etc.
Inline styles that set their own property values that are not described in the theme are highly discouraged.
The only kinds of exceptions that this rule might be very localized padding and margin settings, for example,
but te rule of thumb is that theme values need to be used whenever possible.

## Typography

Text is rendered using the `Heading`, `Text` and `InlineText` components, no inline styling should be added
to any instance of these components.
Instead, for every type of text a variant exists.
These variants are all described in **app/src/style/preset.ts**. So always first check if a valid preset exists
for the text that needs to be rendered. If this doesn't exist yet, then add the stylings as a preset and refer
to its name on the text component using the variant prop. I.e. `<Text variant="body1">This text is rendered using the body1 preset</Text>`.

## Box spacing

The Box component is a primitive that is used throughout for layouts. It has a specialized prop named `spacing`
which will automatically space out all of the component's children vertically. (There'is another prop named
`spacingHorizontal` that does the same, but for horizontal spacing).

Example:

```tsx
<Box spacing={2}>
  <Text>Test text 1</Text>
  <Text>Test text 2</Text>
  <Text>Test text 3</Text>
</Box>
```

In this example each `<Text>` component (except the last one) instance will receive a bottom margin of `0.5rem`
(the second item in the theme's `space` array).
