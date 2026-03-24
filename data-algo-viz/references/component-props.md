# json-render Ink Component Props — Quick Reference

Correct prop names for generating specs. These were verified against the actual Zod schemas in `@json-render/ink/catalog`.

## Layout

### Box
```json
{ "type": "Box", "props": { "flexDirection": "column", "padding": 1, "gap": 1, "marginTop": 1 } }
```

### Newline / Spacer
```json
{ "type": "Newline", "props": {} }
{ "type": "Spacer", "props": {} }
```

## Text & Content

### Heading
```json
{ "type": "Heading", "props": { "text": "Title here", "level": "h1" } }
```
Levels: `h1`, `h2`, `h3`, `h4`

### Text
```json
{ "type": "Text", "props": { "text": "Content here", "bold": true, "color": "green", "dimColor": true } }
```
Props: `text`, `color`, `backgroundColor`, `bold`, `italic`, `underline`, `strikethrough`, `dimColor`, `inverse`, `wrap`

### Badge
```json
{ "type": "Badge", "props": { "label": "Success", "variant": "success" } }
```
Props: `label` (NOT `children`), `variant`

### Divider
```json
{ "type": "Divider", "props": { "title": "Section Name" } }
```

## Data Display

### KeyValue
```json
{ "type": "KeyValue", "props": { "label": "Complexity", "value": "O(n log n)", "labelColor": "cyan" } }
```
Props: `label`, `value`, `labelColor`, `separator`

### Table
```json
{
  "type": "Table",
  "props": {
    "columns": [
      { "header": "Name", "key": "name" },
      { "header": "Time", "key": "time", "align": "right" }
    ],
    "rows": [
      { "name": "QuickSort", "time": "O(n log n)" },
      { "name": "BubbleSort", "time": "O(n²)" }
    ]
  }
}
```
Column props: `header` (NOT `label`), `key`, `width`, `align`

### List
```json
{ "type": "List", "props": { "items": ["Item 1", "Item 2", "Item 3"], "ordered": false } }
```
Props: `items` (string array, NOT children), `ordered`, `bulletChar`, `spacing`

### ListItem (structured)
```json
{ "type": "ListItem", "props": { "title": "HashMap", "subtitle": "O(1) lookup", "leading": "🟢", "trailing": "✓" } }
```

## Charts

### ProgressBar
```json
{ "type": "ProgressBar", "props": { "progress": 0.75, "label": "Pass Rate", "width": 40, "color": "green" } }
```
Props: `progress` (0-1, NOT `value`), `width`, `color`, `label`

### BarChart
```json
{
  "type": "BarChart",
  "props": {
    "data": [
      { "label": "HashMap @ 10K", "value": 10000, "color": "green" },
      { "label": "Sort @ 10K", "value": 132877, "color": "yellow" }
    ],
    "width": 30,
    "showValues": true,
    "showPercentage": false
  }
}
```
Data item: `{ label, value, color? }`. Props: `data`, `width`, `showValues`, `showPercentage`

### Sparkline
```json
{ "type": "Sparkline", "props": { "data": [1, 4, 7, 3, 9, 2, 5] } }
```

## Interactive (use cautiously in non-TTY)

### Card
```json
{ "type": "Card", "props": { "title": "Algorithm Info" }, "children": ["child-1", "child-2"] }
```

### StatusLine
```json
{ "type": "StatusLine", "props": { "text": "All tests passed", "icon": "success" } }
```

### Spinner
```json
{ "type": "Spinner", "props": { "label": "Processing..." } }
```

## Common Mistakes

| Wrong | Correct |
|-------|---------|
| `"value": 0.75` on ProgressBar | `"progress": 0.75` |
| `"children": "text"` on Text | `"text": "content"` |
| `"children": "label"` on Badge | `"label": "text"` |
| `"label": "Col"` in Table column | `"header": "Col"` |
| `"data": [{}]` in Table | `"columns": [...], "rows": [...]` |
| items as children in List | `"items": ["a", "b"]` as prop |
