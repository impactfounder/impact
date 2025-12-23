import Markdoc from '@markdoc/markdoc'
import React from 'react'

interface MarkdocRendererProps {
  content: any
}

// Custom components for Markdoc rendering
const components = {
  Heading: ({ level, children }: { level: number; children: React.ReactNode }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    const styles: Record<number, string> = {
      1: 'text-3xl md:text-4xl font-bold mt-16 mb-6 text-gray-900 leading-tight',
      2: 'text-2xl md:text-3xl font-bold mt-14 mb-5 text-gray-900 leading-tight',
      3: 'text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-900 leading-tight',
      4: 'text-lg md:text-xl font-bold mt-8 mb-3 text-gray-900 leading-tight',
      5: 'text-base md:text-lg font-bold mt-6 mb-2 text-gray-900 leading-tight',
      6: 'text-sm md:text-base font-bold mt-4 mb-2 text-gray-900 leading-tight',
    }
    return <Tag className={styles[level] || styles[6]}>{children}</Tag>
  },
  Paragraph: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-7 leading-8 text-lg text-gray-800 whitespace-pre-wrap break-keep">{children}</p>
  ),
  Strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-bold text-primary">{children}</strong>
  ),
  Emphasis: ({ children }: { children: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:underline"
    >
      {children}
    </a>
  ),
  List: ({ ordered, children }: { ordered: boolean; children: React.ReactNode }) => {
    const Tag = ordered ? 'ol' : 'ul'
    const className = ordered
      ? 'list-decimal list-inside mb-5 space-y-1 text-foreground'
      : 'list-disc list-inside mb-5 space-y-1 text-foreground'
    return <Tag className={className}>{children}</Tag>
  },
  ListItem: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  CodeBlock: ({ children, language }: { children: string; language?: string }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
      <code className={language ? `language-${language}` : ''}>{children}</code>
    </pre>
  ),
  Code: ({ children }: { children: string }) => (
    <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm">{children}</code>
  ),
  Blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-600">
      {children}
    </blockquote>
  ),
  HorizontalRule: () => <hr className="my-8 border-gray-200" />,
  Image: ({ src, alt }: { src: string; alt?: string }) => (
    <img src={src} alt={alt || ''} className="rounded-lg my-6 max-w-full h-auto" />
  ),
}

// Markdoc schema/config
const markdocConfig = {
  nodes: {
    heading: {
      render: 'Heading',
      attributes: {
        level: { type: Number, required: true },
      },
    },
    paragraph: {
      render: 'Paragraph',
    },
    strong: {
      render: 'Strong',
    },
    em: {
      render: 'Emphasis',
    },
    link: {
      render: 'Link',
      attributes: {
        href: { type: String, required: true },
      },
    },
    list: {
      render: 'List',
      attributes: {
        ordered: { type: Boolean, default: false },
      },
    },
    item: {
      render: 'ListItem',
    },
    fence: {
      render: 'CodeBlock',
      attributes: {
        language: { type: String },
        content: { type: String },
      },
    },
    code: {
      render: 'Code',
    },
    blockquote: {
      render: 'Blockquote',
    },
    hr: {
      render: 'HorizontalRule',
    },
    image: {
      render: 'Image',
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
      },
    },
  },
}

export function MarkdocRenderer({ content }: MarkdocRendererProps) {
  if (!content) {
    return <p className="text-gray-500 italic">No content...</p>
  }

  // If content is already a string (markdown), parse it
  if (typeof content === 'string') {
    const ast = Markdoc.parse(content)
    const transformed = Markdoc.transform(ast, markdocConfig)
    return <>{Markdoc.renderers.react(transformed, React, { components })}</>
  }

  // If content is already an AST (from Keystatic)
  try {
    const transformed = Markdoc.transform(content, markdocConfig)
    return <>{Markdoc.renderers.react(transformed, React, { components })}</>
  } catch {
    // Fallback: try to render as-is if it's already transformed
    return <>{Markdoc.renderers.react(content, React, { components })}</>
  }
}
