export const SAMPLE_MARKDOWN = `# Markdown Preview Demo

Welcome to the **live Markdown preview**! This editor supports *GitHub Flavored Markdown* (GFM) with real-time rendering.

## Features Supported

### Text Formatting
- **Bold text** and *italic text*
- ~~Strikethrough text~~
- \`Inline code\` with syntax highlighting
- [Links to external sites](https://github.com)

### Code Blocks

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Markdown Preview\`;
}

greetUser('Developer');
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
\`\`\`

### Lists

#### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered Lists
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

#### Task Lists
- [x] Completed task
- [ ] Pending task
- [x] Another completed task
- [ ] Future task

### Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 |
| **Bold** | ✅ | Strong emphasis |
| *Italic* | ✅ | Emphasis |
| \`Code\` | ✅ | Inline code |
| Links | ✅ | External and internal |
| Images | ✅ | Alt text supported |
| Tables | ✅ | GFM tables |
| Lists | ✅ | Ordered, unordered, tasks |

### Blockquotes

> This is a blockquote. It can contain **bold text**, *italic text*, and even \`code\`.
> 
> > Nested blockquotes are also supported.
> 
> You can include multiple paragraphs in blockquotes.

### Images

![Markdown Logo](https://markdown-here.com/img/icon256.png "Markdown Logo")

### Horizontal Rules

---

### Advanced Features

#### Footnotes
This text has a footnote[^1].

[^1]: This is the footnote content.

#### Definition Lists
Term 1
:   Definition 1

Term 2
:   Definition 2a
:   Definition 2b

---

## Try It Out!

Edit this text in the left panel and watch the preview update in real-time. The preview is debounced by 200ms for optimal performance.

**Features:**
- ⚡ Real-time preview
- 🎨 Dark theme
- 📱 Mobile responsive
- 📋 Copy HTML to clipboard
- 🔒 Sanitized HTML output
- 🚀 Built with Next.js 15

*Happy writing!* 🚀`