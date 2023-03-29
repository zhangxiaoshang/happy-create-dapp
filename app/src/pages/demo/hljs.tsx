import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import prettier from 'prettier/standalone';
import parserTypeScript from 'prettier/parser-typescript';
console.log({ prettier, parserTypeScript });

hljs.registerLanguage('javascript', javascript);

function CodeSnippet({ code }: any) {
  const codeRef = useRef<any>(null);

  useEffect(() => {
    hljs.highlightBlock(codeRef.current);
  }, [code]);

  return (
    <pre>
      <code ref={codeRef} className="javascript">
        {code}
      </code>
    </pre>
  );
}

// export default CodeSnippet;

export default function CodeDemo() {
  const code = `
function helloWorld() {
        console.log('Hello, World!');
  }`;

  const formattedCode = prettier.format(code, {
    parser: 'typescript',
    plugins: [parserTypeScript],
  });

  return <CodeSnippet code={formattedCode} />;
}
